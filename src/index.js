// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import express from "express";
import connectDB from "../src/db/index.js";

const app = express();

dotenv.config({
    path: './env'
})

connectDB()
    .then(
        () => {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`we are running on the port ${process.env.PORT}`)
            })
        }
    ).catch((err) => {
        console.log("MONGODB  connection FAIL!!", err)
    })