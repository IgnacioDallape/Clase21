import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { passportCall, authorization } from '../config/passport.js';

const { Router } = express;
const router = new Router();

router.post('/login', (req, res) => {
    if (req.body.username === 'nacho@mail.com' && req.body.password === 1234) {
        let token = jwt.sign({
            email: req.body.username,
            password: req.body.password,
            role: 'user'
        }, 'secreto123', { expiresIn: '24h' });

        res.cookie('cookieToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
            .send({ message: 'user logged' });
    }
});

router.get('/home', passportCall('jwt'), authorization('user'), (req, res) => {
    res.send(req.user);
});

export { router };
