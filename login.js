import { connectToDatabase } from './utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Cors from 'cors';

// ... (as funções runMiddleware e cors continuam as mesmas)
const cors = Cors({ methods: ['POST', 'GET', 'HEAD'], origin: '*' });
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  console.log('[LOG] Função /api/login iniciada.'); // LOG 1
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { identifier, password } = req.body;
  console.log(`[LOG] Recebido: identifier=${identifier}`); // LOG 2

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Missing identifier or password' });
  }

  try {
    console.log('[LOG] Tentando conectar ao banco de dados...'); // LOG 3
    const { db } = await connectToDatabase();
    console.log('[LOG] Conexão com o banco de dados bem-sucedida.'); // LOG 4

    const usersCollection = db.collection('users');

    console.log(`[LOG] Procurando usuário: ${identifier}`); // LOG 5
    const user = await usersCollection.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      console.log('[LOG] Usuário não encontrado no banco.'); // LOG 6
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log(`[LOG] Usuário encontrado: ${user.username}`); // LOG 7

    console.log('[LOG] Comparando senhas...'); // LOG 8
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('[LOG] Senha inválida.'); // LOG 9
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('[LOG] Senha válida.'); // LOG 10

    console.log('[LOG] Gerando token JWT...'); // LOG 11
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.VERCEL_JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );
    console.log('[LOG] Token gerado. Enviando resposta de sucesso.'); // LOG 12

    res.status(200).json({ message: 'Logged in successfully', token, user: { username: user.username, email: user.email } });

  } catch (error) {
    // Este log é o mais importante se algo quebrar
    console.error('[ERRO FATAL] Ocorreu um erro no bloco try-catch:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}