import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

const users = [
    { id: '1', username: 'admin', password: 'password', role: 'admin' },
    { id: '2', username: 'developer1', password: 'password', role: 'developer' },
    { id: '3', username: 'devops1', password: 'password', role: 'devops' }
];

app.use(cors());
app.use(bodyParser.json());

app.get('/', (_, res) => {
    res.send('Hello World - simple api with JWT!');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).send({ token, refreshToken });
    } else {
        res.status(401).send('Invalid username or password');
    }
});

app.post('/refreshToken', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).send('Refresh token is required');
    }

    jwt.verify(refreshToken, refreshTokenSecret, (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
            return res.status(403).send('Invalid refresh token');
        }
        const token = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);
        res.status(200).send({ token, refreshToken: newRefreshToken });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

function generateToken(user: any) {
    const exp = Math.floor(Date.now() / 1000) + 60 * 15; // Token expires in 15 minutes
    const token = jwt.sign({ exp, userId: user.id, username: user.username, role: user.role }, tokenSecret, { algorithm: 'HS256' });
    return token;
}

function generateRefreshToken(user: any) {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // Refresh token expires in 7 days
    const refreshToken = jwt.sign({ exp, userId: user.id, username: user.username, role: user.role }, refreshTokenSecret, { algorithm: 'HS256' });
    return refreshToken;
}
