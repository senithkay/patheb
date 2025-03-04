import express from "express";
import {sendResponse} from "../utils/http";
import PEvent from "../models/Event";
import Course from "../models/Course";

const router = express.Router();

router.post("/save-event", async (req, res) => {
    try{
        const event = new PEvent(req.body);
        const savedEvent = await event.save();
        sendResponse(savedEvent, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500);
    }
    return;
})

router.get("/get-events", async (req: express.Request, res: express.Response) => {
    try{
        const events = await PEvent.find();
        sendResponse(events, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
    return;
})

router.put("/edit-event/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const updatedEvent = await PEvent.findByIdAndUpdate(id, req.body, {new: true, runValidators:true});
        sendResponse(updatedEvent, res, undefined,200);
    }
    catch (err){
        sendResponse(undefined, res, err, 500)
    }
})

export default router;