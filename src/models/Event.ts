import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface IPEvent extends Event {
    name:string;
    type:string;
    date:string;
    time:string;
    location:string;
    organizer:string;
    attendees: number;
    status:string;
}

const pEventSchema = new Schema({
    name: {
        type: String,
        required: [true, "Event name is required"],
    },
    type:{
        type: String,
        required: [true, "Event type is required"],
    },
    date:{
        type: Date,
        required: [true, "Event date is required"],
    },
    time: {
        type:String,
        required: [true, "Event time is required"],
    },
    location:{
        type:String,
        required: [true, "Event location is required"],
    },
    organizer:{
        type:String,
        required: [true, "Event organizer is required"],
    },
    attendees:{
        type:Number,
        required: [true, "Event attendee is required"],
        default: 0,
    },
    status: {
        type:String,
        required: [true, "Event status is required"],
        default: "Upcoming",
    }
})

const PEvent = mongoose.model<IPEvent>('PEvent', pEventSchema);
export default PEvent;
