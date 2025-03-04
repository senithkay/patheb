import express from "express";
import {sendResponse} from "../utils/http";
import Appointment from "../models/Appoinment";
import Course from "../models/Course";

const router = express.Router();

router.get('/get-available-slots/:date', async(req: express.Request, res: express.Response) => {
    try{
        const date = req.params.date;
        const dayEnd = "17:00";
        const dayStartTime = "08:00";
        const appointments = await Appointment.find({date}).sort('startTime')
        const availableSlots = [];
        if (appointments.length===0){
            if (getTimeDifInMinutes(dayStartTime, dayEnd)>=30){
                availableSlots.push({
                    start:dayStartTime,
                    end:dayEnd,
                });
            }
            sendResponse(availableSlots, res, undefined,200);
            return;
        }

        const firstAppointment = appointments[0];
        const getFirstDifference = getTimeDifInMinutes(dayStartTime, firstAppointment.startTime);
        if (getFirstDifference>=30){
            availableSlots.push({
                start:dayStartTime,
                end:firstAppointment.startTime,
            });
        }
        for (let i = 0;i<appointments.length;i++){
            const currentAppointment = appointments[i];
            if (i==appointments.length-1){
                if (getTimeDifInMinutes(currentAppointment.endTime, dayEnd)>=30){
                    availableSlots.push({
                        start:currentAppointment.endTime,
                        end:dayEnd,
                    });
                }
                sendResponse(availableSlots, res, undefined,200);
                return;
            }
            const nextAppointment = appointments[i+1];

            const gapStart = currentAppointment.endTime;
            const gapEnd = nextAppointment.startTime;

            if (getTimeDifInMinutes(gapStart, gapEnd)>=30){
                availableSlots.push({
                    start:gapStart,
                    end:gapEnd,
                });
            }
        }
        sendResponse(availableSlots, res, undefined,200);
        return;
    }
    catch(err){
        console.log(err);
        sendResponse(undefined, res,err,500);
    }
    return;
})

router.post('/save-appointment', async (req: express.Request, res: express.Response) => {
    try{
        const appointment = new Appointment(req.body);
        const savedAppointment = appointment.save();
        sendResponse(savedAppointment, res, undefined,200);
    }
    catch(err){
        sendResponse(undefined, res, err, 500);
    }
    return;
})

router.get('/get-appointments', async(req: express.Request, res: express.Response) => {
    try{
        const appointments = await Appointment.find();
        sendResponse(appointments, res, undefined,200);
        return;
    }
    catch (err){
        sendResponse(undefined, res, err, 500);
        return;
    }
});

router.get('/get-past-appointments', async(req: express.Request, res: express.Response) => {
    try{
        const today = new Date();
        const appointments = await Appointment.find({ date: { $lt: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}` } });
        sendResponse(appointments, res, undefined,200);
        return;
    }
    catch (err){
        sendResponse(undefined, res, err, 500);
        return;
    }
});

router.get('/get-appointment/:id', async(req: express.Request, res: express.Response) => {
    try{
        const id = req.params.id;
        const appointment = await Appointment.findById(id);
        sendResponse(appointment, res, undefined,200);
        return;
    }
    catch (err){
        sendResponse(undefined, res, err, 500);
        return;
    }
});

router.put("/approve-appointment/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const newAppointment = {
            status: "Confirmed"
        }
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, newAppointment, {new: true});
        sendResponse(updatedAppointment, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
    return;
})

router.put("/cancel-appointment/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const newAppointment = {
            status: "Cancelled"
        }
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, newAppointment, {new: true});
        sendResponse(updatedAppointment, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
    return;
})

const getTimeDifInMinutes = (t1:string, t2:string)=>{
    const startTime = getTimeInMinutes(t1)
    const endTime = getTimeInMinutes(t2)
    return (endTime - startTime);
}

const getTimeInMinutes = (t1:string)=>{
    const [hour, minute] = t1.split(":");
    return parseInt(hour)*60 + parseInt(minute);
}

export default router;