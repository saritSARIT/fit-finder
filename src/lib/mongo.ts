// const { MongoClient, ServerApiVersion } = require('mongodb');
import { MongoClient, Db } from "mongodb";
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

if (!user || !password) throw new Error("Missing MongoDB credentials in .env");
const uri = `mongodb+srv://${user}:${password}@fitfinder.mpjxiuc.mongodb.net/FitFinder?retryWrites=true&w=majority`


// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//     serverSelectionTimeoutMS: 10000,
//     tls: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     //await client.close();
//   }
// }
// run().catch(console.dir);


const options = {
  serverSelectionTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global var to persist across hmr in dev
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // in production (Vercel) always create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(); // or provide name: client.db("mydb")
}

export default clientPromise;

