import express = require('express');
import User from "../models/User";
import {sendResponse} from "../utils/http";
import {logger} from "../utils/logger";
import {createFakeToken, createToken} from "../utils/auth";
import bcrypt from "bcrypt";
import {ErrorMessages} from "../utils/common";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
   let responseCode = 401
    try{
       let error = undefined
       const user = await User.findOne({email: req.body.email})
       if (!user){
            sendResponse({}, res, ErrorMessages.INCORRECT_USERNAME_OR_PASSWORD, 401);
            return
       }
       else{
           const isAuth = await bcrypt.compare(req.body.password, user.password)
           let data:any = {}
           if (!isAuth){
               error = ErrorMessages.INCORRECT_USERNAME_OR_PASSWORD
               responseCode = 401
           }
           else{
               data = {_id: user._id, username: user.username, uLocation: user.uLocation, isSuperAdmin:user.isSuperAdmin, email: user.email}
               const token = createToken(user._id, user.uLocation, user.isSuperAdmin);

               res.cookie('jwt', token, {httpOnly: false, maxAge: process.env.JWT_MAX_AGE, domain:process.env.CLIENT_DOMAIN, sameSite:false});
               responseCode = 200
           }
           sendResponse(data, res, error, responseCode);
       }
   }
   catch (err){
       logger(err)
   }


})


router.post("/register", async (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
    })
    let error = undefined;
    let data:any = {}
    try{
         const savedUser= await user.save();
         const token = createToken(savedUser._id, savedUser.uLocation, savedUser.isSuperAdmin);
         res.cookie('jwt', token, {
             // httpOnly: true,
             maxAge: process.env.JWT_MAX_AGE,
         })
        data = {_id: savedUser._id, username: savedUser.username}
    }
    catch(err){
        logger(err)
        error = (err as any)
    }
    sendResponse(data, res, error);
})

router.post("/logout", async (req, res) => {
    res.send('logout');
})

router.get('/logout', async (req: express.Request, res: express.Response) => {
    const token = createFakeToken();
    res.cookie('jwt', token, {httpOnly: false, maxAge: 0, domain:'localhost'});
    res.send({});
})

router.get('/reset-password/:id', (req, res) => {
    const id = req.params.id;
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.MAIL_ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.MAIL_ENCRYPTION_IV, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(id, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    const decryptedData = JSON.parse(decrypted);
    const date = new Date();
    const initiatedTime  =  new Date(decryptedData.time)
    const currentTime  =  new Date()
    const timeDif = currentTime.getTime() - initiatedTime.getTime();
    if (timeDif > 300000){
        sendResponse({}, res, 'Link expired',400)
    }
    else{
        res.redirect(`${process.env.PROTOCOL}://${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}/reset-password/${id}`);
    }

})

router.post('/pwd-reset', async (req, res) => {
    let data: any = {}
    let error = undefined;
    let responseStatus = 200
    try {
        const encrypted = req.body.key
        const algorithm = 'aes-256-cbc';
        const key = Buffer.from(process.env.MAIL_ENCRYPTION_KEY, 'hex');
        const iv = Buffer.from(process.env.MAIL_ENCRYPTION_IV, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        const decryptedData = JSON.parse(decrypted);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const updatedUser = await User.findOneAndUpdate({email: decryptedData.email}, {password: hashedPassword}, {new: true});
        if (updatedUser) {
            data = {_id: updatedUser._id}
        }
    } catch (err) {
        logger(err)
        error = err
        responseStatus = 500
    }
    sendResponse(data, res, error,  responseStatus)
})

router.post('/change-password', async (req, res) => {
    let data: any = {}
    let error = undefined;
    let responseStatus = 200
    try {
        const cookies = req.cookies??{};
        const token = cookies.jwt;
        if (token){
            jwt.verify(token, process.env.JWT_SECRET, async (err:any, decoded:any) => {
                let foundUser = await User.findById(decoded.id)
                if(foundUser === undefined || foundUser === null){
                    error = "User not found";
                    responseStatus = 401;
                    sendResponse(data, res, error,  responseStatus)
                }
                else{
                    const isAuth = await bcrypt.compare(req.body.oldPassword, foundUser.password)
                    if (isAuth){
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
                        const user = await User.findOneAndUpdate({_id:decoded.id}, {password: hashedPassword})
                        if(user === undefined || user === null){
                            error = "Could not change the password";
                            responseStatus = 500
                            sendResponse(data, res, error,  responseStatus)
                        }
                        else{
                            data = {_id: user._id, username: user.username, uLocation: user.uLocation, isSuperAdmin:user.isSuperAdmin, email: user.email}
                            sendResponse(data, res, undefined,  responseStatus)
                        }
                    }
                    else{
                        error = "Current password is incorrect"
                        responseStatus = 500
                        sendResponse(data, res, error,  responseStatus)
                    }
                }
            })
        }
        else{
            error = "Unauthorized user"
            logger(error)
            responseStatus = 401
            sendResponse(data, res, error,  responseStatus)
        }
    } catch (err) {
        logger(err)
        error = err
        responseStatus = 500
        sendResponse(data, res, error,  responseStatus)
    }
})

router.get('/sendmail/:email', async (req: express.Request, res: express.Response) => {
    const email = req.params.email;
    const user  = await User.findOne({ email });
    if (!user){
        sendResponse({}, res, 'Incorrect email', 400);
        return
    }

    const date = new Date();
    const plaintext = {
        id: user._id,
        time: new Date(),
        email: email
    };
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.MAIL_ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.MAIL_ENCRYPTION_IV, 'hex');


    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(JSON.stringify(plaintext), 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const resetPasswordUrl =`http://localhost:3000/auth/reset-password/${encrypted}`
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.APPLICATION_EMAIL_USER,
            pass: process.env.APPLICATION_EMAIL_PASSKEY,
        },
    });

    transporter.sendMail({
        from: 'tivitytest101@gmail.com',
        to: email,
        subject: "Password Reset Request",
        text: '',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
</head>
<body>
    <p>Dear Admin,</p>


    <p>We have received a request to reset your password for <strong>Your Neil's Bakery Admin Account</strong>.</p>

    <p>To proceed with the password reset, please click on the following link:</p>

    <p><a href="${resetPasswordUrl}">Reset Password</a></p>

    <p>If you did not request this password reset or believe this request to be in error, please disregard this email.</p>

    <p>Please note that the link above will expire in 10 minutes, so be sure to complete the password reset process promptly.</p>

    <p>Thank you.</p>

    <p>Best regards,<br>
    Super Admin<br>
</body>
</html>`,
    }).then((info)=>{
        res.redirect(`${process.env.PROTOCOL}://${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}/`);
    });

})


export default router;