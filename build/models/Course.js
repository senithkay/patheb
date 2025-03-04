"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const courseSchema = new Schema({
    cid: {
        type: String,
        required: [true, "CID is required"],
        unique: [true, "The course ID has to be unique"],
        index: [true]
    },
    department: {
        type: String,
        required: [true, "Department is required"],
    },
    courseTitle: {
        type: String,
        required: [true, "Course Title is required"],
    },
    instructor: {
        type: String,
        required: [true, "Instructor is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    status: {
        type: String,
        default: "Active"
    },
    prerequisites: {
        type: Schema.Types.ObjectId,
    },
    requiredMaterials: {
        type: String,
    },
    additionalNotes: {
        type: Schema.Types.ObjectId,
    }
});
const Course = mongoose_1.default.model('Course', courseSchema);
exports.default = Course;
