"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AppointmentSchema = new Schema({
    student: {
        type: String,
        required: [true, "Student name is required"],
    },
    date: {
        type: Date,
        required: [true, "Appointment date is required"],
    },
    startTime: {
        type: String,
        required: [true, "Appointment startTime is required"],
    },
    endTime: {
        type: String,
        required: [true, "Appointment endTime is required"],
    },
    type: {
        type: String,
        required: [true, "Appointment type is required"],
    },
    status: {
        type: String,
        required: [true, "Appointment status is required"],
    },
    purpose: {
        type: String,
        required: [true, "Appointment purpose is required"],
    },
    notes: {
        type: String,
        required: [true, "Appointment notes is required"],
    },
    email: {
        type: String,
        required: [true, "Student email is required"],
    },
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
    }
});
const Appointment = mongoose_1.default.model('Appointment', AppointmentSchema);
exports.default = Appointment;
