import jwt from 'jsonwebtoken';
import {UserModel} from "../models/user.js";
import {verifyPassword,hashPassword} from "../utils/utils.js";


export async function login(req, res){
    const user = await UserModel.findOne({email: req.body.email });
    if(!user){
        return res.status(400).json({"message":"Cet utilisateur n'existe pas"});
    }

    if(await verifyPassword(req.body.password,user.password)){
        const token = jwt.sign(
            { userId: user.id , role: user.role, email:user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        req.session.token = {token:token , role: user.role, email:user.email};
        
        return res.status(200).json({token:req.session.token,user:user});
    }else{
        return res.status(403).json({"message":"Mot de passe incorrect"});
    }
}
export function logout(req, res){
    req.session.destroy();

    return res.redirect('/');
}

export async function register(req, res){
    const {password,email,passwordConfirm,firstName,lastName} = req.body;
    const user = await UserModel.findOne({email: req.body.email });
    if(user){
        return res.status(404).json({"message":"Cet utilisateur existe déjà"});
    }
    if(password !== passwordConfirm){
        return res.status(404).json({"message":"Les mots de passe ne correspondent pas"});
    }
    const newUser = new UserModel({
        email: email,
        password: hashPassword(password),
        firstname: firstName,
        lastname: lastName,
        isAdmin: false
    });

    await newUser.save();
    return res.status(200).json({"message":"Inscription réussie"});

  };

  