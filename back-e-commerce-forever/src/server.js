import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//App config
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors());


//api endpoints
app.use("/api/forever/user", userRouter);
app.use("/api/forever/product", productRouter);
app.use("/api/forever/cart", cartRouter);
app.use("/api/forever/order", orderRouter);

connectDB().then(r => {

    connectCloudinary()

    app.listen(port, () => {
        console.log("Server running on PORT: " + port);
    });

}).catch(err => console.log(err.message));





