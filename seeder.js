const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Camp = require('./models/Camp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON file
const camps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/camps.json`, 'utf-8')
);
// Read JSON file
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
// Read JSON file
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

// Read JSON file
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import into db
const importData = async () => {
  try {
    await Camp.create(camps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data imported ...'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
// Delete datan
const deleteData = async () => {
  try {
    await Camp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted ...'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
