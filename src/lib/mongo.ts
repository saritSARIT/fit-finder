import { MongoClient } from "mongodb";
const uri = process.env.MONGO_URI;
console.log("MONGO_URI: *****************************", uri);
if (!uri) throw new Error("Missing MONGO_URI in environment variables");
const options = { serverSelectionTimeoutMS: 10000 };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// declare global {
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;

