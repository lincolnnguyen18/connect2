import 'dotenv/config';
import express from 'express';
import mysql2 from 'mysql2/promise';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Server } from 'socket.io';
import http from 'http';
import { createClient } from 'redis';

(async () => {
  const conn = await mysql2.createConnection({
    host: 'localhost',
    user: 'admin',
    password: process.env.DB_PASSWORD,
    database: 'connect_app',
    multipleStatements: true,
    timezone: 'Z'
  });

  const clients = {};
  const publisher = createClient();
  publisher.on('error', (err) => console.log('Redis Client Error', err));
  await publisher.connect();
  const subscriber = createClient();
  subscriber.on('error', (err) => console.log('Redis Client Error', err));
  await subscriber.connect();
  await subscriber.subscribe('main', async (message) => {
    // console.log('Message received: ', message);
    const { type } = JSON.parse(message);
    switch (type) {
      case 'friend-request':
        const { to } = JSON.parse(message);
        clients[to] && clients[to].emit('friend-request', message);
        break;
    }
  });

  // setTimeout(() => {
  //   publisher.publish('main', 'Hello from the publisher');
  // }, 3000);

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());
  // app.use(express.static('../vue/dist'));

  const ping = () => { conn.query('SELECT 1'); }

  setInterval(() => { ping(); }, 60000);

  const validToken = async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let [rows, fields] = await conn.query('SELECT id, username FROM users WHERE id = ?', [decoded.id]);
      if (rows.length === 0) {
        return null
      }
      return rows[0];
    } catch (err) {
      return null
    }
  };

  const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    let user = await validToken(token);
    if (user) {
      req.user = user;
      next();
    } else {
      res.redirect('/login');
    }
  };

  const isNotLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    if (await validToken(token)) {
      res.redirect('/');
    } else {
      next();
    }
  };

  const router = express.Router();

  router.post('/is-loggedin', async (req, res) => {
    const token = req.cookies.token;
    let user = await validToken(token);
    res.send({ user });
  });

  router.post('/register', isNotLoggedIn, async (req, res) => {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
      const [rows, fields] = await conn.query('CALL register_user(?, ?, @id); select @id', [username, hash]);
      let id = rows[1][0]['@id'];
      let token = jwt.sign({ id: id }, process.env.JWT_SECRET);
      // res.send({ token });
      res.cookie('token', token);
      res.json({});
    } catch (err) {
      console.log(err);
      res.json({ error: 'Username already exists' });
    }
  });

  router.post('/login', isNotLoggedIn, async (req, res) => {
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
          res.cookie('token', token);
          res.json({});
        } else {
          res.send({ error: 'Invalid password' });
        }
      }
    } catch (err) {
      console.log(err);
      res.send({ error: 'Invalid password' });
    }
  });

  router.get('/get-users', isLoggedIn, async (req, res) => {
    let { username } = req.query;
    // console.log(`${req.user.id} search for ${username}`);
    try {
      const [rows, fields] = await conn.query('CALL get_users_to_friend(?, ?)' , [req.user.id, username]);
      res.send(rows[0]);
    } catch (err) {
      console.log(err);
      res.send({ error: 'Invalid password' });
    }
  });

  router.post('/send-friend-request', isLoggedIn, async (req, res) => {
    const { username } = req.body;
    try {
      await conn.query('CALL send_friend_request(?, ?)' , [req.user.id, username]);
      await conn.query(`CALL send_message(?, ?, ?)`, [username, req.user.username, `Friend request received from ${req.user.username}`]);
      // await conn.query(`CALL send_message(?, ?, ?)`, [username, req.user.username, `Friend request sent to ${req.user.username}`]);
      publisher.publish('main', JSON.stringify({
        type: 'friend-request',
        to: username
      }));
      res.send({});
    } catch (err) {
      console.log(err);
      res.send({ error: 'Error sending friend request' });
    }
  });

  router.get('/get-friend-requests', isLoggedIn, async (req, res) => {
    try {
      const [rows, fields] = await conn.query('CALL get_friend_requests(?)' , [req.user.id]);
      res.send(rows[0]);
    } catch (err) {
      console.log(err);
      res.send({ error: 'Error getting friend requests' });
    }
  });

  router.get('/get-messages', isLoggedIn, async (req, res) => {
    const { username, limit, offHr, offMin } = req.query;
    try {
      const [rows, fields] = await conn.query('CALL get_messages(?, ?, ?, ?, ?)' , [req.user.id, username, limit, offHr, offMin]);
      console.log(`calling get_messages(${req.user.id}, ${username}, ${limit}, ${offHr}, ${offMin})`);
      console.log(rows[0]);
      res.send(rows[0]);
    } catch (err) {
      console.log(err);
      res.send({ error: 'Error getting messages' });
    }
  });

  app.use('/api', router);

  // app.get('*', (req, res) => {
  //   res.sendFile('index.html', { root: '../vue/dist' });
  // });

  app.use('*', createProxyMiddleware({ target: 'http://localhost:3000' }));

  // setup app with socket.io
  const port = 3001;
  const server = http.createServer(app);
  const io = new Server(server);
  io.on('connection', (socket) => {
    socket.on('login', async (token) => {
      const user = await validToken(token);
      if (user) {
        console.log(`${user.username} connected`);
        clients[user.username] = socket;
        socket.username = user.username;
      } else {
        socket.disconnect();
      }
    });
    socket.on('disconnect', () => {
      console.log(`${socket.username} disconnected`);
      delete clients[socket.username];
    });
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
})();