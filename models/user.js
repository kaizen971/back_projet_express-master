import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    phone:String,
    birthdate:String,
    city:String,
    country:String,
    photo:String,
    category:String,
    isAdmin:Boolean,
    likes:Array,
    favoris:Array,
});

export const UserModel = model("User", UserSchema);