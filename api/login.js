import { connectToDatabase } from './utils/db'; //
import bcrypt from 'bcryptjs'; //
import jwt from 'jsonwebtoken'; //
import Cors from 'cors'; //

const cors = Cors({ //
  methods: ['POST', 'GET', 'HEAD'], //
  origin: '*', // Lembre-se de configurar para o seu domínio em produção
});

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
  await runMiddleware(req, res, cors); //

  if (req.method !== 'POST') { //
    return res.status(405).json({ message: 'Method Not Allowed' }); //
  }

  const { identifier, password } = req.body; // 'identifier' pode ser username ou email

  if (!identifier || !password) { //
    return res.status(400).json({ message: 'Missing identifier or password' }); //
  }

  try {
    const { db } = await connectToDatabase(); //
    const usersCollection = db.collection('users'); //

    const user = await usersCollection.findOne({ //
      $or: [{ username: identifier }, { email: identifier }], //
    });

    if (!user) { //
      return res.status(400).json({ message: 'Invalid credentials' }); //
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); //

    if (!isPasswordValid) { //
      return res.status(400).json({ message: 'Invalid credentials' }); //
    }

    // Gerar um token JWT
    // Você precisa de uma chave secreta forte. Crie uma variável de ambiente VERCEL_JWT_SECRET
    const token = jwt.sign( //
      { userId: user._id.toString(), username: user.username }, //
      process.env.VERCEL_JWT_SECRET || 'your_jwt_secret_key', // Use uma variável de ambiente em produção!
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    res.status(200).json({ message: 'Logged in successfully', token, user: { username: user.username, email: user.email } }); //

  } catch (error) { //
    console.error('Login error:', error); //
    res.status(500).json({ message: 'Internal server error' }); //
  }
}