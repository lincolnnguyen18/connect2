require('dotenv').config()
import express from 'express';
import mysql2 from 'mysql2/promise';
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const ping = () => { conn.query('SELECT 1'); }

setInterval(() => { ping(); }, 60000);

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err && decoded.id) {
      let [rows, fields] = await conn.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (rows.length > 0) {
        req.user = rows[0];
        next();
      } else {
        res.json({ error: 'User not found' });
      }
    }
  });
};