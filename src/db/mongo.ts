import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/techlead-teste";

export const connectMongoDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
