import mongoose from 'mongoose';

let connectionPromise = null;

export async function connectDatabase() {
  if (connectionPromise) return connectionPromise;

  const mongoUri = process.env.MONGODB_URI || '';
  if (!mongoUri) {
    console.warn('MONGODB_URI is not set. Sequential course API will use in-memory fallback storage.');
    return null;
  }

  connectionPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then((connection) => {
      console.log('MongoDB connected for Class360 learning API');
      return connection;
    })
    .catch((error) => {
      console.error('MongoDB connection failed. Falling back to in-memory storage.', error.message);
      connectionPromise = null;
      return null;
    });

  return connectionPromise;
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
