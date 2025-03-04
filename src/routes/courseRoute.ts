import express from "express";
import Course from "../models/Course";
import {sendResponse} from "../utils/http";


const router = express.Router();

router.post("/save-course", async (req, res) => {
    try{
        const course = new Course(req.body);
        const savedCourse = await course.save();
        sendResponse(savedCourse, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
    return;
})

router.get("/get-courses", async (req: express.Request, res: express.Response) => {
    try{
        const courses = await Course.find();
        sendResponse(courses, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
    return;
})

router.put("/cancel-course:id", async (req, res) => {
    try{
        const id = req.params.id;
        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {new: true});
        sendResponse(updatedCourse, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
    return;
})

router.put("/edit-course/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {new: true, runValidators:true});
        sendResponse(updatedCourse, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
})

export default router;