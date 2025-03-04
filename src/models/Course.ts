import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface ICourse extends Document {
    cid:string;
    department:string;
    courseTitle:string;
    instructor:string;
    description:string;
    status:string;
    prerequisites:mongoose.Types.ObjectId;
    requiredMaterials:string;
    additionalNotes:string;
}

const courseSchema = new Schema({
    cid:{
        type: String,
        required: [true, "CID is required"],
        unique: [true, "The course ID has to be unique"],
        index: [true]
    },
    department:{
        type:String,
        required: [true, "Department is required"],
    },
    courseTitle:{
        type:String,
        required: [true, "Course Title is required"],
    },
    instructor:{
        type:String,
        required: [true, "Instructor is required"],
    },
    description:{
        type:String,
        required: [true, "Description is required"],
    },
    status: {
        type:String,
        default:"Active"
    },
    prerequisites:{
        type:Schema.Types.ObjectId,
    },
    requiredMaterials:{
        type:String,
    },
    additionalNotes: {
        type:Schema.Types.ObjectId,
    }
})

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;