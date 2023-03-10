import jwt from "jsonwebtoken";
import {UserModel} from "./models/user.js";
import  { check, validationResult } from 'express-validator';

export const logged = async (req, res, next) => {
  let authHeader = null;
  
  if(req.headers){
     authHeader = req.headers['authorization'];
  }
    if (!authHeader) return res.status(401).json({ message: 'Auth failed' });

    try {
        const verifToken = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (verifToken) {
            req.authUser = (await UserModel.findOne({_id: verifToken.userId}));
            next();
        }
        else
            console.log("Token invalide")
    }
    catch (err) {
        console.log(err)
    }
}

export const checkAdmin = (req, res, next) => {
  try {
    if (req.authUser.isAdmin === false) {
      return res.json({
        message: 'Vous n\'avez pas les droits pour accéder à cette page',
      });
    }

    next();

  } catch (error) {
      console.log(error)
    return res.json({
      message: 'Auth failed'
    });
  }
};



export const validateBody = (req, res, next) => {
    const { email, password, firstName, lastName, country, city, category, gender, birthdate, phone, photo, isAdmin } = req.body;
  
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: 'Email is not valid' });
    }
  
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ message: 'First name is required' });
    }
  
    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ message: 'Last name is required' });
    }

  
    next();
  
};
