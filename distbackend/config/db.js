import "dotenv";
import Mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is completely missing from your .env file!');
}
Mongoose.connect(MONGODB_URI);
Mongoose.connection.on("connected", () => {
    console.log("Mongo has connected succesfully");
});
Mongoose.connection.on("reconnected", () => {
    console.log("Mongo has reconnected");
});
Mongoose.connection.on("error", (error) => {
    console.log("Mongo connection has an error", error);
    Mongoose.disconnect();
});
Mongoose.connection.on("disconnected", () => {
    console.log("Mongo connection is disconnected");
});
export default Mongoose;
//# sourceMappingURL=db.js.map