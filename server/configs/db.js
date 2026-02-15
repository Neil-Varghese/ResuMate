import mongoose from "mongoose";

const connectDB = async () => {
    try {
        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if (!mongodbURI) {
            throw new Error("MONGODB_URI environment variable not set");
        }

        if (mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1);
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`);
        console.log("Database connected successfully");

        mongoose.connection.on("disconnected", () => {
            console.warn("Database disconnected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Database connection error:", err.message);
        });
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
};

export default connectDB;