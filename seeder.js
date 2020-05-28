const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Camp = require('./models/Camp');
const Course = require('./models/Course');

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

// Import into db
const importData = async () => {
  try {
    await Camp.create(camps);
    await Course.create(courses);
    console.log('Data imported ...'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
// Delete data
const deleteData = async () => {
  try {
    await Camp.deleteMany();
    await Course.deleteMany();
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
