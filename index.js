const express = require('express');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Blood, Sweat, and Tears ');
  next();
});

app.use(
  cors({
    credentials: true,
    origin: '*',
  })
);

app.use(express.static('public'));

app.use(express.json());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(fileUpload());

app.use(routes);

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
