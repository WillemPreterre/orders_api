import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const payload = {
    sub: '1234567890',
    username: 'testuser',
};


const secret = process.env.SECRET_KEY; 

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Token JWT généré :', token);
