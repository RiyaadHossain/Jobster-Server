const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
const userRoute = require('./routes/userRoute')
const jobRoute = require('./routes/jobRoute')
const applyRoute = require('./routes/applyRoute')
const candidateRoute = require('./routes/candidateRoute')

const run = async () => {
  try {

    app.use('/', userRoute)
    app.use('/', jobRoute)
    app.use('/', applyRoute)
    app.use('/', candidateRoute)

  } finally { }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
