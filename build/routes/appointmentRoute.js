"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("../utils/http");
const Appoinment_1 = __importDefault(require("../models/Appoinment"));
const router = express_1.default.Router();
router.get('/get-available-slots/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = req.params.date;
        const dayEnd = "17:00";
        const dayStartTime = "08:00";
        const appointments = yield Appoinment_1.default.find({ date }).sort('startTime');
        const availableSlots = [];
        if (appointments.length === 0) {
            if (getTimeDifInMinutes(dayStartTime, dayEnd) >= 30) {
                availableSlots.push({
                    start: dayStartTime,
                    end: dayEnd,
                });
            }
            (0, http_1.sendResponse)(availableSlots, res, undefined, 200);
            return;
        }
        const firstAppointment = appointments[0];
        const getFirstDifference = getTimeDifInMinutes(dayStartTime, firstAppointment.startTime);
        if (getFirstDifference >= 30) {
            availableSlots.push({
                start: dayStartTime,
                end: firstAppointment.startTime,
            });
        }
        for (let i = 0; i < appointments.length; i++) {
            const currentAppointment = appointments[i];
            if (i == appointments.length - 1) {
                if (getTimeDifInMinutes(currentAppointment.endTime, dayEnd) >= 30) {
                    availableSlots.push({
                        start: currentAppointment.endTime,
                        end: dayEnd,
                    });
                }
                (0, http_1.sendResponse)(availableSlots, res, undefined, 200);
                return;
            }
            const nextAppointment = appointments[i + 1];
            const gapStart = currentAppointment.endTime;
            const gapEnd = nextAppointment.startTime;
            if (getTimeDifInMinutes(gapStart, gapEnd) >= 30) {
                availableSlots.push({
                    start: gapStart,
                    end: gapEnd,
                });
            }
        }
        (0, http_1.sendResponse)(availableSlots, res, undefined, 200);
        return;
    }
    catch (err) {
        console.log(err);
        (0, http_1.sendResponse)(undefined, res, err, 500);
    }
    return;
}));
router.post('/save-appointment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = new Appoinment_1.default(req.body);
        const savedAppointment = appointment.save();
        (0, http_1.sendResponse)(savedAppointment, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
    }
    return;
}));
router.get('/get-appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield Appoinment_1.default.find();
        (0, http_1.sendResponse)(appointments, res, undefined, 200);
        return;
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
        return;
    }
}));
router.get('/get-past-appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const appointments = yield Appoinment_1.default.find({ date: { $lt: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}` } });
        (0, http_1.sendResponse)(appointments, res, undefined, 200);
        return;
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
        return;
    }
}));
router.get('/get-appointment/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const appointment = yield Appoinment_1.default.findById(id);
        (0, http_1.sendResponse)(appointment, res, undefined, 200);
        return;
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
        return;
    }
}));
router.put("/approve-appointment/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newAppointment = {
            status: "Confirmed"
        };
        const updatedAppointment = yield Appoinment_1.default.findByIdAndUpdate(id, newAppointment, { new: true });
        (0, http_1.sendResponse)(updatedAppointment, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
    }
    return;
}));
router.put("/cancel-appointment/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newAppointment = {
            status: "Cancelled"
        };
        const updatedAppointment = yield Appoinment_1.default.findByIdAndUpdate(id, newAppointment, { new: true });
        (0, http_1.sendResponse)(updatedAppointment, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
    }
    return;
}));
const getTimeDifInMinutes = (t1, t2) => {
    const startTime = getTimeInMinutes(t1);
    const endTime = getTimeInMinutes(t2);
    return (endTime - startTime);
};
const getTimeInMinutes = (t1) => {
    const [hour, minute] = t1.split(":");
    return parseInt(hour) * 60 + parseInt(minute);
};
exports.default = router;
