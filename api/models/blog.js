const mongoose=require("mongoose");

const BlogSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    summary:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    cover:{
        type:String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },
},{timestamps:true});

module.exports=mongoose.model("Blog",BlogSchema);