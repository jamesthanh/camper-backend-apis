const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHanlder = require('./middleware/error');
const connectDB = require('./config/db');

// Load config file
dotenv.config({ path: './config/config.env' });

//Conenct to database
connectDB();

// Route file
const camps = require('./routes/camps');
const courses = require('./routes/courses');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Moute Routers
app.use('/api/v1/camps', camps);
app.use('/api/v1/courses', courses);

app.use(errorHanlder);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server and exist process
  server.close(() => process.exit(1));
});
