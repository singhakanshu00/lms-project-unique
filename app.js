const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());   // It will every json data coming through post req and parse it to object so that we can use.
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const port = process.env.PORT || 3000;
const dbURI = 'mongodb+srv://akii:7699662622@cluster0.xwrtq.mongodb.net/JwtAuth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(port, () => {
    console.log("Server started at port 3000");
  }))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
//dummy routes
// app.get('/set-cookies', (req, res) => {
//   // res.setHeader('Set-Cookie', 'newUser=true');
//   res.cookie('newUser', false);
//   res.cookie('newEmployee', true);
//   // res.cookie('newEmployee', true, {maxAge: 1000*60*60*24, secure: true});
//   res.send("you got the cookies");
// });

// app.get('/read-cookies', (req, res) => {
//   const cookie = req.cookies;
//   console.log(cookie);
//   res.json(cookie);
// });