
import { MongoClient, Db, Collection, ServerApiVersion } from 'mongodb';
import type { Program, Application, User, Payment } from '@/types';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

interface GlobalWithMongo extends NodeJS.Global {
  _mongoClientPromise?: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as GlobalWithMongo)._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    (global as GlobalWithMongo)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as GlobalWithMongo)._mongoClientPromise!;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
  });
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const mongoClient = await clientPromise;
  return mongoClient.db(); // You can specify DB name here if not in URI: client.db("learnflow")
}

// Collections
export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDb();
  return db.collection<User>('users');
}

export async function getProgramsCollection(): Promise<Collection<Program>> {
  const db = await getDb();
  return db.collection<Program>('programs');
}

export async function getApplicationsCollection(): Promise<Collection<Application>> {
  const db = await getDb();
  return db.collection<Application>('applications');
}

export async function getPaymentsCollection(): Promise<Collection<Payment>> {
  const db = await getDb();
  return db.collection<Payment>('payments');
}

export default clientPromise;
