import express from "express";
import { login, logout,register} from "./controllers/AuthController.js";
import {addUser, updateUser, getUser, randomUser, deleteUser, getUserById} from "./controllers/UserController.js";
import {logged, checkAdmin} from "./middleware.js";
import {validateBody} from "./middleware.js";
import {createArticle,getArticles} from "./controllers/ArticleController.js";
import fs from "fs";
import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
const router = express.Router();

router.post('/login', login);

router.post('/register', register);


 // A partir d'ici toutes les routes nécessitent d'être connectés a l'appli
// router.use(logged);

router.get('/logout', logout);


router.post('/createArticle', upload.single("photo"), createArticle);

router.get('/articles', getArticles);

router.get('/image', (req, res) => {
    console.log("yes")
    const imagePath = 'E:/Blog/back_projet_express-master/uploads//1678287990918-LogoConnexion.png'; // chemin vers l'image sur le serveur
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur de serveur');
      }
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data);
    });
});

// router.post('/updateUser',validateBody, updateUser);
// router.post('/users',validateBody, addUser);
// router.delete('/users/:id', deleteUser);

export default router;