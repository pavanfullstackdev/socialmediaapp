// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`we are running on the port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB  connection FAIL!!", err);
  });
