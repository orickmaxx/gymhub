import { connectToDatabase } from './utils/db'; //
import bcrypt from 'bcryptjs'; //
import Cors from 'cors'; // // Importe o pacote cors

// Inicialize o middleware CORS
const cors = Cors({ //
  methods: ['POST', 'GET', 'HEAD'], // Permite apenas POST, GET, HEAD
  origin: '*', // Em desenvolvimento, '*' é ok. Em produção, especifique o domínio do seu frontend (ex: 'https://gymhub.vercel.app')
});

// Helper para executar o middleware CORS
function runMiddleware(req, res, fn) { //
  return new Promise((resolve, reject) => { //
    fn(req, res, (result) => { //
      if (result instanceof Error) { //
        return reject(result); //
      }
      return resolve(result); //
    });
  });
}

export default async function handler(req, res) { //
  await runMiddleware(req, res, cors); // Execute o middleware CORS

  if (req.method !== 'POST') { //
    return res.status(405).json({ message: 'Method Not Allowed' }); //
  }

  const { username, email, password } = req.body; //

  if (!username || !email || !password) { //
    return res.status(400).json({ message: 'Missing required fields' }); //
  }

  try {
    const { db } = await connectToDatabase(); //
    const usersCollection = db.collection('users'); //

    const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] }); //
    if (existingUser) { //
      return res.status(409).json({ message: 'Username or email already exists' }); //
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o salt rounds

    const newUser = { //
      username, //
      email, //
      password: hashedPassword, //
      createdAt: new Date(), //
    };

    await usersCollection.insertOne(newUser); //

    res.status(201).json({ message: 'User registered successfully' }); //

  } catch (error) { //
    console.error('Registration error:', error); //
    res.status(500).json({ message: 'Internal server error' }); //
  }
}