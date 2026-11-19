import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import profileRouter from "./routes/profile.router.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.LOCAL_HOST,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/profile", profileRouter);

app.use((req, res, next) =>{
    res.status(404).send("Page not found!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, (err) =>{
    if(err) throw err;
    console.log(`Express is listening at port: ${PORT}`);
});