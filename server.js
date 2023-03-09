import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import router from "./router.js";
import session from 'express-session';
import dotenv from "dotenv";
import MongoStore from 'connect-mongo';
import mongoose from "mongoose";
import localtunnel from "localtunnel";
import cors from "cors"
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const absolutePublicPath = path.join(__dirname, 'public');
dotenv.config();
const app = express();
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(express.static(absolutePublicPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    name: 'user',
    secret: 'simple',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl:'mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME }),
    cookie : { maxAge : 180 * 60 * 1000 }, // on détermine la durée de vie de la session
}));

mongoose.connect('mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true }
)

app.listen(process.env.APP_PORT, () => {
    console.log(`Example app listening at http://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`)
});


app.use(router);
