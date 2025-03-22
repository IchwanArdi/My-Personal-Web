const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const MongoStore = require('connect-mongo');

// Load config
dotenv.config();

// Connect to database
connectDB();

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Hanya true saat production (deploy)  NODE_ENV=development untuk di localhost
      httpOnly: true, // Melindungi dari akses client-side JS
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 hari
    },
  })
);

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));
app.use('/img', express.static('public/img'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/data', express.static(__dirname + '/data'));
app.use(cors());
app.use(methodOverride('_method'));

// Routes setup
app.use('/', require('./routes/index'));
app.use('/', require('./routes/pictureRoutes'));
app.use('/', require('./routes/blogRoutes'));
app.use('/', require('./routes/projectRoutes'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/projectDashboard'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
