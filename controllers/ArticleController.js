
import { ArticleModel } from '../models/articles.js';

export async function createArticle(req, res){
    const {title,description,category,photo} = req.body;
    const newArticle = new ArticleModel({
        title: title,
        description: description,
        category: category,
        photo: req.file,
    });
    console.log(req.file);
    return res.status(200).json({"message":"Article créé"});
};


export async function getArticles(req, res){
    const articles = await ArticleModel.find();

    return res.status(200).json(articles);
}