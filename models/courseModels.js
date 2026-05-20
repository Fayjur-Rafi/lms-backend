import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    price:{type:Number,required:true}
});

const courses = mongoose.model('courses', courseSchema);
export default courses;