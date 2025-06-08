const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

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

// Session setup
app.use(session({
  secret: 'random-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,           
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 hours
  }
}));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, 'users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error reading user data.");
    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch {
      res.status(500).send("Error parsing user data.");
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const filePath = path.join(__dirname, 'users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error reading user data.");
    try {
      const users = JSON.parse(data);
      const user = users.find(u => u.email === username && u.password === password);

      if (user) {
        req.session.user = user;
        res.json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } catch {
      res.status(500).send("Error parsing user data.");
    }
  });
});

app.get("/getauth", (req, res) => {
  if (req.session.user) {
    res.json({ valid: true, user: req.session.user });
  } else {
    res.json({ valid: false });
  }
});

app.get("/settings", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { userid, firstname, lastname, email } = req.session.user;

  res.json({
    userid,
    firstname,
    lastname,
    email
  });
});


app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Error logging out.");
    }
    res.json({ message: "Logout successful" });
  });
});
//catcher for 404
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).send('Server Error');
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
