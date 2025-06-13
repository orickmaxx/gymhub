import { connectToDatabase } from './utils/db'; //
import jwt from 'jsonwebtoken'; //
import { ObjectId } from 'mongodb'; // // Importe ObjectId para trabalhar com IDs do MongoDB
import Cors from 'cors'; //

const cors = Cors({ //
  methods: ['GET', 'POST', 'PUT', 'HEAD'], //
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

// Middleware de autenticação simples para proteger as rotas
async function authenticateToken(req, res) { //
  const authHeader = req.headers['authorization']; //
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) { //
    res.status(401).json({ message: 'Authentication token required' }); //
    return false; //
  }

  return new Promise((resolve) => { //
    jwt.verify(token, process.env.VERCEL_JWT_SECRET || 'your_jwt_secret_key', (err, user) => { //
      if (err) { //
        res.status(403).json({ message: 'Invalid or expired token' }); //
        return resolve(false); //
      }
      req.user = user; // Adiciona os dados do usuário decodificados ao request
      resolve(true); //
    });
  });
}

export default async function handler(req, res) { //
  await runMiddleware(req, res, cors); //

  const isAuthenticated = await authenticateToken(req, res); //
  if (!isAuthenticated) { //
    return; // Resposta já enviada pelo authenticateToken
  }

  const { db } = await connectToDatabase(); //
  const workoutsCollection = db.collection('workouts'); //
  const userId = req.user.userId; // ID do usuário do token JWT

  if (req.method === 'POST') { //
    const { date, planoId, treinoNome, exercises } = req.body; //

    if (!date || !planoId || !treinoNome || !exercises) { //
      return res.status(400).json({ message: 'Missing required workout fields' }); //
    }

    try {
      const newWorkout = { //
        userId: new ObjectId(userId), // Associa o treino ao usuário
        date, //
        planoId, //
        treinoNome, //
        exercises, //
        createdAt: new Date(), //
      };
      await workoutsCollection.insertOne(newWorkout); //
      res.status(201).json({ message: 'Workout saved successfully' }); //
    } catch (error) { //
      console.error('Error saving workout:', error); //
      res.status(500).json({ message: 'Internal server error' }); //
    }
  } else if (req.method === 'GET') { //
    try {
      const userWorkouts = await workoutsCollection.find({ userId: new ObjectId(userId) }).toArray(); //
      // Retorne os treinos de uma forma que seu frontend possa consumir facilmente
      const formattedWorkouts = {}; //
      userWorkouts.forEach(workout => { //
        formattedWorkouts[workout.date] = { //
          planoId: workout.planoId, //
          treinoNome: workout.treinoNome, //
          completed: true, // Ou baseie na lógica de exercises, mas para o resumo basta completed
          exercises: workout.exercises || {} // Garante que exercises exista
        };
      });
      res.status(200).json(formattedWorkouts); //
    } catch (error) { //
      console.error('Error fetching workouts:', error); //
      res.status(500).json({ message: 'Internal server error' }); //
    }
  } else if (req.method === 'PUT') { //
    const { date, planoId, treinoNome, exercises, completed } = req.body; //

    if (!date || !planoId || !treinoNome || !exercises || typeof completed !== 'boolean') { //
      return res.status(400).json({ message: 'Missing required fields for update' }); //
    }

    try {
      const result = await workoutsCollection.updateOne( //
        { userId: new ObjectId(userId), date: date }, //
        { $set: { planoId, treinoNome, exercises, completed, updatedAt: new Date() } }, //
        { upsert: true } // Se não existir, insere um novo documento
      );
      if (result.matchedCount === 0 && result.upsertedCount === 0) { //
        return res.status(404).json({ message: 'Workout not found or could not be updated/inserted' }); //
      }
      res.status(200).json({ message: 'Workout updated successfully' }); //
    } catch (error) { //
      console.error('Error updating workout:', error); //
      res.status(500).json({ message: 'Internal server error' }); //
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' }); //
  }
}