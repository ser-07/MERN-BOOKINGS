import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to MongoDB database"))
  .catch((err) => console.error(err));

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); //added after getting CORS error
// app.use(bodyParser.json()) //added after being not body showing undefined when passed from react application. Was workng with postman before this change
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
//   }));

app.use(express.json());
app.use(cookieParser()); //To accept cookies

app.listen(3005, ()=>{
    console.log("Server is running on Port 3005s..")
});


//Route for fetching user
// app.get('/',(req, res)=>{
//     res.send("Working...")
// })

app.use('/api/user',userRouter );
app.use('/api/auth',authRouter );


//Route for adding user

//middleware

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.log("Middleware", req.body);

    return res.status(statusCode).json({
        success: false,
        statusCode:statusCode,
        message: message,
    })
});
