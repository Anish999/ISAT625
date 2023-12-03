const express = require('express');
const colors = require('colors');
const path = require('path');
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors');

connectDB()

const uri = process.env.MONGO_URI;
const app = express();

app.use(cors({
  origin: '*',
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const port = process.env.PORT | 3001;

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello from server!" });
});

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/topics', require('./routes/topicRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/subscription', require('./routes/subscriptionRoutes'))

//Serve frontend
if(process.env.NODE_ENV == 'production'){
  app.use(express.static(path.join(__dirname,'../client/build')))
  app.get('*', (req,res) => {
    return res.sendFile(path.resolve(__dirname,'../','client','build','index.html'))
  })
} else {
  app.get('/', (req,res) => res.send('Please set to production'))
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});