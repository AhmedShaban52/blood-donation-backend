import mongoose from "mongoose"

// Connect to MongoDB Database
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("database connected"))

    await mongoose.connect(`${process.env.MONGODB_URI}/blood-donation`)
}

export default connectDB