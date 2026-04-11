import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      tls: true,
      tlsInsecure: true
    };

    // Ultimate bypass for Windows Node.js DNS ETIMEOUT bug with MongoDB Atlas SRV.
    // Modern MongoDB drivers use dns.promises instead of callback-based dns.
    try {
      const dns = require('dns');
      
      const mockSrv = [
        { name: 'ac-etrkoax-shard-00-00.bo4aemq.mongodb.net', port: 27017, priority: 0, weight: 0 },
        { name: 'ac-etrkoax-shard-00-01.bo4aemq.mongodb.net', port: 27017, priority: 0, weight: 0 },
        { name: 'ac-etrkoax-shard-00-02.bo4aemq.mongodb.net', port: 27017, priority: 0, weight: 0 }
      ];
      
      const mockTxt = [ [ 'authSource=admin&replicaSet=atlas-oqwjfk-shard-0' ] ];

      if (dns.promises) {
        const origSrvPromise = dns.promises.resolveSrv;
        dns.promises.resolveSrv = async function(hostname: string) {
          if (hostname.includes('dreamhomes-cluster')) return mockSrv;
          return origSrvPromise(hostname);
        };
        const origTxtPromise = dns.promises.resolveTxt;
        dns.promises.resolveTxt = async function(hostname: string) {
          if (hostname.includes('dreamhomes-cluster')) return mockTxt;
          return origTxtPromise(hostname);
        };
      }
    } catch(err) {
      console.error(err);
    }

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
