const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const methodOverride = require('method-override');
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
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // Session bertahan 14 hari
    }),
    cookie: { secure: false },
  })
);

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/images', express.static(__dirname + '/public/img'));
app.use('/uploads', express.static(__dirname + '/public/uploads'));
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
