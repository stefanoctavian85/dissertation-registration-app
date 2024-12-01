import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { expressjwt } from 'express-jwt';
import { getAccountByUsername, getAccountById, migrate } from './db/service.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

migrate();

// app.use(expressjwt({
//     secret: 'my-secret',
//     algorithms: ['HS256'],
// }));

const PORT = process.env.PORT;

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const account = await getAccountByUsername(req.body.username);

    if (!account) {
        return res.status(400).json({message: 'Invalid username or password!' });
    }

    if (username === account.username && password === account.password) {
        return res.status(200).json({ message: 'Login successful!' });
    }

    return res.status(400).json({ message: 'Invalid username or password!' });
});


app.listen(PORT, () => {
    console.log(`has started on port ${PORT}!`);
});