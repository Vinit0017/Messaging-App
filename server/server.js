require("dotenv").config();
import express from "express";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/auth", authRouter);

app.use((req, res, next) =>{
    res.status(404).send("Page not found!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) =>{
    if(err) throw err;
    console.log(`Express is listening at port: ${PORT}`);
});