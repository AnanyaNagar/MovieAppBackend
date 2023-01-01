import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtTokens } from '../utils/jwt-helpers.js'
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();


router.get('/', async (req, res)=>{
    try {
        console.log("getting all users");
        const users = await pool.query("SELECT * FROM userauth");
        console.log("sending users")
        res.json({users: users.rows});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// register new user
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
        const newUser = await pool.query(
            "INSERT INTO userauth (user_email, user_password) VALUES($1, $2) RETURNING *", 
            [req.body.user_email, hashedPassword]);
        res.json("User Successfully registered!");
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// login a user
router.post('/login', async (req, res) => {
    try {
        const {user_email, user_password} = req.body;
        const users = await pool.query("SELECT * FROM userauth WHERE user_email = $1", [user_email]);
        console.log(users.rows);
        if (users.rows.length === 0) return res.status(401).json({ error: "Email is invalid" });
        const validPassword = await bcrypt.compare(user_password, users.rows[0].user_password);
        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

        //we'll pass a json web token
        let tokens = jwtTokens(users.rows[0]);
        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        
        console.log("Login Attempt", res.statusMessage, req.body, tokens, users.rows[0].user_id);
        res.json({tokens: tokens, user_id: users.rows[0].user_id});
    } catch (error) {
        res.status(401).json({ error: error.message });
        console.log("Login Attempt", res.statusMessage, req.body);
    }
})

// refresh the access token using refresh token 
router.post('/refresh_token', (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken == null) return res.status(401).json({ error: 'Null refresh token' });
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            
            console.log(user);
            if (error) {
                console.log("Refresh token error: ", error.message);
                return res.status(403).json({ error: error.message });
            }
            
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
            res.json(tokens);
        })
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ error: error.message });
    }
})

// logout option
router.delete('/logout', authenticateToken, (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

export default router;
