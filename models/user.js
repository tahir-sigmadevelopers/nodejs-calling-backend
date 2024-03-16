import mongoose from "mongoose";
import validator from "validator";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: [true, "User Already Exist With This Email"],
    // validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    select: false,
  },

  role: {
    type: String,
    default: "student",
  },
  country:{
    type:String,
    required: true,
  },
  state:{
    type:String,
    required: true,
  },
  street:{
    type:String,
    required: true,

  },
  zipcode:{
    type:String,
    required: true,

  },
  phoneNumber:{
    type:String,
    required: true,

  },
  approved:{
    type:Boolean,
    default:false
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});





const User = mongoose.model("User", userSchema);

export default User;
