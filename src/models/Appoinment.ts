import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface IAppointment extends Document {
    student:string;
    email:string;
    contactNumber:string;
    date:Date;
    startTime:string;
    endTime:string;
    type:string;
    status:string;
    purpose:string;
    notes:string;
}

const AppointmentSchema = new Schema({
    student:{
        type:String,
        required: [true, "Student name is required"],
    },
    date: {
        type: Date,
        required: [true, "Appointment date is required"],
    },
    startTime: {
        type:String,
        required: [true, "Appointment startTime is required"],
    },
    endTime: {
        type:String,
        required: [true, "Appointment endTime is required"],
    },
    type: {
        type:String,
        required: [true, "Appointment type is required"],
    },
    status: {
        type:String,
        required: [true, "Appointment status is required"],
    },
    purpose: {
        type:String,
        required: [true, "Appointment purpose is required"],
    },
    notes: {
        type:String,
        required: [true, "Appointment notes is required"],
    },
    email:{
        type:String,
        required: [true, "Student email is required"],
    },
    contactNumber:{
        type:String,
        required: [true, "Contact number is required"],
    }
})

const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export default Appointment;