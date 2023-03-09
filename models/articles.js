import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ArticleSchema = new Schema({
    title: String,
    description: String,
    like: Number,
    comment: Array,
    author:String,
    dateCreate:String,
    photo:String,
    category:String,
});

export const ArticleModel = model("Article", ArticleSchema);