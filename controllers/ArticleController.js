
import { ArticleModel } from '../models/articles.js';
import { UserModel } from '../models/user.js';
import { ObjectId } from 'mongodb';

export async function createArticle(req, res){
    const {title,description,category,photo} = req.body;
    //vérifier si les données sont bien présentes
    if(!title || !description || !category || !req.file){
        return res.status(400).json({"message":"Données manquantes"});
    }

    if(req.file.size > 1000000 || (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg")){ 
        return res.status(400).json({"message":"Image trop lourde"});
    }
    const newArticle = new ArticleModel({
        title: title,
        description: description,
        category: category.toLowerCase(),
        photo: req.file,
        author: req.authUser._id,
        like:0
    });
    newArticle.save()
    return res.status(200).json({"message":"Article créé"});
};


export async function getArticles(req, res){
    const articles = await ArticleModel.find();

    return res.status(200).json(articles);
}

export async function getArticleBySearch(req, res){
    const {search} = req.params;
    const article = await ArticleModel.find({
        "$or": [
          {"title": {"$regex": `${search}`, "$options": "i"}},
          {"description": {"$regex": `${search}`, "$options": "i"}},
          {"category": {"$regex": `${search}`, "$options": "i"}}
        ]
    })
    return res.status(200).json(article);
}
 
export async function getArticleById(req, res){
    try {
       validateObjectId(req.params.id);
        // L'identifiant est valide, continuer le traitement
 
    const article = await ArticleModel.findById(req.params.id);

    if(!article){
        return res.status(404).json({"message":"Article non trouvé"});
    }
    return res.status(200).json(article);

    } catch (err) {
    // Gérer l'erreur ici
    return res.status(400).json({"message":"Identifiant invalide"});
  }

}
 
function validateObjectId(id) {
    if (!ObjectId.isValid(id)) {
      throw new BSONTypeError(`Invalid ObjectId: ${id}. Must be a string of 12 bytes or a string of 24 hex characters or an integer.`);
    }
  }

export async function postComment(req, res){
    const {id,comment} = req.body;
    if(!id || !comment){
        return res.status(400).json({"message":"Données manquantes"});
    }
    try {
    validateObjectId(id);

    const article = await ArticleModel.findById(id);

    if(!article){
        return res.status(404).json({"message":"Article non trouvé"});
    }
    const newArticle = article

    newArticle.comment.push({author:req.authUser?.email,comment:comment,date:new Date(Date.now())});
    newArticle.save();
    return res.status(200).json({"message":"Commentaire ajouté"});
    } catch (err) {
        return res.status(400).json({"message":"Identifiant invalide"});
    }

} 

export async function postlike(req, res){

    const {id} = req.body;
    if(!id ){
        return res.status(400).json({"message":"Données manquantes"});
    }
    try {

    validateObjectId(id);

    const user = await UserModel.findById(req.authUser._id);
    const article = await ArticleModel.findById(id);
        const newUser = user;
        const newArticle = article;

    if(!user.likes.includes(id)){

     newArticle.like = newArticle.like+1;
    newUser.likes.push(article._id);
    newUser.save();
    newArticle.save();
    return res.status(200).json({"message":"Like ajouté"});
    }else{

        newArticle.like = newArticle.like-1;
        newUser.likes.pop(article._id);
        newUser.save();
        newArticle.save();
        return res.status(200).json({"message":"Like supprimé"});
    }
    }catch (err) {
        return res.status(400).json({"message":"ID invalide"});
    }
}

export async function postfavoris(req,res){
    const {id} = req.body;
    if(!id ){
        return res.status(400).json({"message":"Données manquantes"});
    }
    try {
        validateObjectId(id);
        const user = await UserModel.findById(req.authUser._id);
        const article = await ArticleModel.findById(id);
        const newUser = user;
        const newArticle = article;
        if(!user.favoris.includes(id)){
            newUser.favoris.push(article._id);
            newUser.save();
            newArticle.save();
            return res.status(200).json({"message":"Favoris ajouté"});
        }else{
            newUser.favoris.pop(article._id);
            newUser.save();
            newArticle.save();
            return res.status(200).json({"message":"Favoris supprimé"});
        }




    }catch (err) {
        return res.status(400).json({"message":"ID invalide"});
    }
}

export async function getfavoris(req, res){
    const user = await UserModel.findById(req.authUser._id);
    const articles = await ArticleModel.find({
        "_id": {"$in": user.favoris}
    })
    return res.status(200).json(articles);
}

export async function isfavoris(req, res){
    const user = await UserModel.findById(req.authUser._id);
    const article = await ArticleModel.findById(req.params.id);
    if(user.favoris.includes(article._id)){
        return res.status(200).json({"message":"Article favoris","favoris":true});
    }else{
        return res.status(200).json({"message":"Article non favoris","favoris":false});
    }
}
export async function islike(req, res){
    const user = await UserModel.findById(req.authUser._id);
    const article = await ArticleModel.findById(req.params.id);
    if(user.likes.includes(article._id)){
        return res.status(200).json({"message":"Article like","like":true});
    }else{
        return res.status(200).json({"message":"Article non like","like":false});
    }
}

export async function deleteArticle(req, res){
    const {id} = req.params;
    if(!id){
        
        return res.status(400).json({"message":"Données manquantes"});
    }

    try{
    const article = await ArticleModel.findById(req.params.id);
    if(!article){
        return res.status(404).json({"message":"Article non trouvé"});
    }
    if(article.author != req.authUser?._id && req.authUser?.isAdmin == false){
        return res.status(401).json({"message":"Vous n'avez pas les droits"});
    }
    await ArticleModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({"message":"Article supprimé"});
    }catch (err) {
        return res.status(400).json({"message":"ID invalide"});
    }


}

export async function editArticle(req,res){
    const {id} = req.params;
    const {title,description,category} = req.body;
    if(!id || !title || !description || !category){
        return res.status(400).json({"message":"Données manquantes"});
    }
    try{
        const article = await ArticleModel.findById(req.params.id);
        if(!article){
            return res.status(404).json({"message":"Article non trouvé"});
        }
        if(article.author != req.authUser?._id && req.authUser?.isAdmin == false){
            return res.status(401).json({"message":"Vous n'avez pas les droits"});
        }
        article.title = title;
        article.description = description;
        article.category = category;
        if(req.file){
            article.photo = req.file;
        }
        article.save();
        return res.status(200).json({"message":"Article modifié"});
    
    }catch (err) {
        return res.status(400).json({"message":"ID invalide"});
    }



    
}

export async function  getArticleBySearchFavoris(req,res){

    const {search} = req.params;
    const user = await UserModel.findById(req.authUser._id);

    const article = await ArticleModel.find({
        "_id": {"$in": user.favoris},
        "$or": [
          {"title": {"$regex": `${search}`, "$options": "i"}},
          {"description": {"$regex": `${search}`, "$options": "i"}},
          {"category": {"$regex": `${search}`, "$options": "i"}}
        ]
    })
    return res.status(200).json(article);
}