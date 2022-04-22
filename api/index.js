import 'dotenv/config';
import express from 'express';
import mysql2 from 'mysql2/promise';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

(async () => {
  const conn = await mysql2.createConnection({
    host: 'localhost',
    user: 'admin',
    password: process.env.DB_PASSWORD,
    database: 'connect_app',
    multipleStatements: true
  });

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());
  app.use(express.static('../vue/dist'));

  const ping = () => { conn.query('SELECT 1'); }

  setInterval(() => { ping(); }, 60000);

  const validToken = async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Decoded id: ${decoded.id}`);
      let [rows, fields] = await conn.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (rows.length === 0) {
        return null
      }
      return decoded.id;
    } catch (err) {
      console.log(`Error validating token: ${err}`);
      return null
    }
  };

  const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    if (await validToken(token)) {
      next();
    } else {
      res.redirect('/login');
    }
  };

  const router = express.Router();

  router.post('/is-loggedin', async (req, res) => {
    const { token } = req.body;
    let id = await validToken(token);
    console.log({ id, token });
    res.send({ id });
  });

  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
      const [rows, fields] = await conn.query('CALL register_user(?, ?, @id); select @id', [username, hash]);
      let token = jwt.sign({ id: rows[1][0]['@id'] }, process.env.JWT_SECRET);
      res.send({ token });
    } catch (err) {
      console.log(err);
      res.send({ error: 'Username already exists' });
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const [rows, fields] = await conn.query('SELECT id, password FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        res.send({ error: 'Invalid password' });
      } else {
        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
          let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
          res.send({ token });
        } else {
          res.send({ error: 'Invalid password' });
        }
      }
    } catch (err) {
      console.log(err);
      res.send({ error: 'Invalid password' });
    }
  });


  app.use('/api', router);

  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../vue/dist' });
  });

  const port = 3003;
  app.listen(port, () => console.log(`Listening on port ${port}`));

})();