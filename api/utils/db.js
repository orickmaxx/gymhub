import { MongoClient, ServerApiVersion } from 'mongodb'; //

const uri = process.env.MONGODB_URI; //
let client; //
let clientPromise; // // Para reutilizar a conexão em funções serverless

if (!uri) { //
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local or Vercel Environment Variables'); //
}

export async function connectToDatabase() { //
  if (client) { //
    return { client, db: client.db('gymhub') }; // Reutiliza a conexão existente
  }

  if (!clientPromise) { //
    // Cria um MongoClient com um MongoClientOptions objeto para definir a versão da API estável
    clientPromise = MongoClient.connect(uri, { //
      serverApi: { //
        version: ServerApiVersion.v1, //
        strict: true, //
        deprecationErrors: true, //
      }
    });
  }

  client = await clientPromise; //
  return { client, db: client.db('gymhub') }; // 'gymhub' será o nome do seu banco de dados
}