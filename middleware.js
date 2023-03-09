import jwt from "jsonwebtoken";
import {UserModel} from "./models/user.js";
import  { check, validationResult } from 'express-validator';

export const logged = async (req, res, next) => {
  if(req.body?.header){
    var authHeader = req.body?.header['Authorization'];
  }
    if (!authHeader) return res.json("Vous n'êtes pas connecté");

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
    const { email, password, firstname, lastname, country, city, category, gender, birthdate, phone, photo, isAdmin } = req.body;
  
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: 'Email is not valid' });
    }
  
    if (!firstname || !firstname.trim()) {
      return res.status(400).json({ message: 'First name is required' });
    }
  
    if (!lastname || !lastname.trim()) {
      return res.status(400).json({ message: 'Last name is required' });
    }
  
    if (!country || !country.trim()) {
      return res.status(400).json({ message: 'Country is required' });
    }
  
    if (!city || !city.trim()) {
      return res.status(400).json({ message: 'City is required' });
    }
  
    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required' });
    }
  
    if (!gender || !gender.trim()) {
      return res.status(400).json({ message: 'Gender is required' });
    }
  
    if (!birthdate || !birthdate.trim()) {
      return res.status(400).json({ message: 'Birthdate is required' });
    }
  
    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: 'Phone is required' });
    }
  
    if (!photo || !photo.trim()) {
      return res.status(400).json({ message: 'Photo is required' });
    }
  
    if (typeof isAdmin === 'undefined') {
      return res.status(400).json({ message: 'isAdmin is required' });
    }
  
    next();
  
};
