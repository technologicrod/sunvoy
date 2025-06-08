const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');            
const path = require('path');        

const app = express();
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
