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
const Event_1 = __importDefault(require("../models/Event"));
const router = express_1.default.Router();
router.post("/save-event", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = new Event_1.default(req.body);
        const savedEvent = yield event.save();
        (0, http_1.sendResponse)(savedEvent, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
    }
    return;
}));
router.get("/get-events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.default.find();
        (0, http_1.sendResponse)(events, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
    }
    return;
}));
router.put("/edit-event/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updatedEvent = yield Event_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        (0, http_1.sendResponse)(updatedEvent, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)(undefined, res, err, 500);
    }
}));
exports.default = router;
