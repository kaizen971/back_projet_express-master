import express from "express";
import { login, logout,register} from "./controllers/AuthController.js";
import {addUser, updateUser, getUser, randomUser, deleteUser, getUsers, getUserById} from "./controllers/UserController.js";
import {logged, checkAdmin} from "./middleware.js";
import {validateBody} from "./middleware.js";
import {createArticle,getArticles,getArticleBySearch,getArticleById,postComment,postlike,postfavoris,getfavoris,isfavoris,deleteArticle,editArticle,getArticleBySearchFavoris} from "./controllers/ArticleController.js";
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

router.post('/register',validateBody, register);
router.get('/image/:cheminImage', (req, res) => {
  // link : http://localhost:3000/image/uploads/1678287888133-LogoConnexion.jpg
  const cheminImage = req.params.cheminImage;
  const imagePath = `./uploads//${cheminImage}`; // chemin vers l'image sur le serveur
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur de serveur');
      }
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data);
    });
});


 // A partir d'ici toutes les routes nécessitent d'être connectés a l'appli
router.use(logged);

router.get('/logout', logout);


router.post('/createArticle', upload.single("photo"), createArticle);

router.get('/articles', getArticles);


router.get('/search/:search', getArticleBySearch);

router.get('/getfavoris',getfavoris);

router.get('/favorisSearch/:search', getArticleBySearchFavoris);

router.get('/article/:id', getArticleById);

router.post('/postComment', postComment);

router.post('/like', postlike);

router.post('/favoris', postfavoris);

router.get('/isfavoris/:id',isfavoris);

router.delete('/deleteArticle/:id', deleteArticle);

router.post('/editArticle/:id', upload.single("photo"), editArticle);

router.get('/profil',getUser);

router.post('/profil',updateUser);

router.get('/getUsers',getUsers);

router.delete('/deleteUser/:id', deleteUser);

router.get('/getUserById/:id',getUserById);

router.post('/editUser/:id',updateUser); 

// router.post('/updateUser',validateBody, updateUser);
// router.post('/users',validateBody, addUser);
// router.delete('/users/:id', deleteUser);

export default router;