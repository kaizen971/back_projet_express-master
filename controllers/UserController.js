import {UserModel} from "../models/user.js";
import jwt from "jsonwebtoken";
import {hashPassword, manipulateDate} from "../utils/utils.js";

export async function getUser(req,res){
    const users = await UserModel.findOne({email:req.authUser.email});
    if(!users){
        return res.status(403).json({"message":"Cet Utilisateur n'existe pas"});
    }
    return res.status(200).json(users);
}

export async function getUserById(req,res){
    const user = await UserModel.findOne({_id:req.params.id});
    if (!req.authUser.isAdmin){
        return res.status(403).json({"message":"Vous n'avez pas les droits pour modifier cet utilisateur"});
    }
    if(!user){
        return res.status(404).json({"message":"Cet Utilisateur n'existe pas"})
    }

    return res.status(200).json(user);
}

export async function updateUser(req,res){
    if (!req.authUser.isAdmin){
        return res.status(403).json({"message":"Vous n'avez pas les droits pour modifier cet utilisateur"});
    }
    let updateData = req.body;
    let result = null;
    // Mise à jour des informations de l'utilisateur en fonction de l'id
    if(req.body.password != req.body.passwordConfirm){
        return res.status(403).json({"message":"Les mots de passe ne correspondent pas"});
    }
    if(req.body){
        const update = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            isAdmin: req.body.isAdmin,
          };
        
        if (req.body.password && req.body.password.trim().length > 0) {
            update.password = hashPassword(req.body.password);
        }
        const result = await UserModel.updateOne({ email: updateData.email }, { $set:update });
    }

    return res.status(200).json({"message" : "Update effectuée", "user": await UserModel.findOne({ email: updateData.email })});
}


export async function randomUser(req, res){
    const excludeEmail = req.session.token ? jwt.verify(req.session.token, process.env.JWT_SECRET).email : null;
    const user = await UserModel.aggregate([
        { $match: { email: { $ne: excludeEmail } } },
        { $sample: { size: 1 } }
    ]);

    return res.json(user[0]);
}
export async function deleteUser(req, res){
    if(!req.authUser.isAdmin) return res.json({"message":"Vous n'avez pas les droits pour supprimer un utilisateur"});

    await UserModel.deleteOne({ _id: req.params.id, isAdmin: false });
    res.json({ "message": "User supprimé" });
}

export async function addUser(req, res){
    if (!req.authUser.isAdmin) return res.json({"message":"Vous n'avez pas les droits pour ajouter un utilisateur"});

    const result = await UserModel.insertMany(
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            country: req.body.country,
            city: req.body.city,
            category: req.body.category,
            gender: req.body.gender,
            phone: req.body.phone,
            photo: req.body.photo,
            birthdate: req.body.birthdate,
            isAdmin: req.body.isAdmin === '1',
            password: hashPassword(req.body.password)
        });

    if (!result)
        return res.status(500).send({"message" : "Erreur lors de l'ajout de l'utilisateur"});
    return res.status(200).json({"message" : "Utilisateur créer"});

}

export async function getUsers(req, res){
    if(!req.authUser.isAdmin) return res.json({"message":"Vous n'avez pas les droits pour voir les utilisateurs"});
    const users = await UserModel.find();
    return res.json(users);
}