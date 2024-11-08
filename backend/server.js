// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const caseRoutes = require('./routes/cases');
const hospitalRoutes = require('./routes/hospitals');
const vaccinationRoutes = require('./routes/vaccination');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 8000;

// dotenv.config();

// Check if the MONGO_URI is defined in the environment variables
// if (!process.env.MONGO_URI) {
//   console.error('MONGO_URI is not defined in .env file!');
//   process.exit(1); // Exit the process if the URI is missing
// }

app.use(cors());
app.use(express.json());

// console.log(process.env.MONGO_URI); // Check if it's loaded correctly

// Connect to MongoDB
mongoose.connect("mongodb+srv://aasritha:Aash%4048846625@cluster0.r5pnx.mongodb.net/covid19db?retryWrites=true&w=majority")
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.use('/covid', caseRoutes);
app.use('/covid', hospitalRoutes);
app.use('/covid', vaccinationRoutes);
app.use('/covid', authRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
