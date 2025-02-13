import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Charge le fichier manuellement

const payload = {
    sub: '1234567890',
    username: 'testuser',
};


const secret = process.env.SECRET_KEY; // Utilisation de la clé du .env

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Token JWT généré :', token);
