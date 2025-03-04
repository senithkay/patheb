"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const pEventSchema = new Schema({
    name: {
        type: String,
        required: [true, "Event name is required"],
    },
    type: {
        type: String,
        required: [true, "Event type is required"],
    },
    date: {
        type: Date,
        required: [true, "Event date is required"],
    },
    time: {
        type: String,
        required: [true, "Event time is required"],
    },
    location: {
        type: String,
        required: [true, "Event location is required"],
    },
    organizer: {
        type: String,
        required: [true, "Event organizer is required"],
    },
    attendees: {
        type: Number,
        required: [true, "Event attendee is required"],
        default: 0,
    },
    status: {
        type: String,
        required: [true, "Event status is required"],
        default: "Upcoming",
    }
});
const PEvent = mongoose_1.default.model('PEvent', pEventSchema);
exports.default = PEvent;
