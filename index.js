const express = require('express');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const FileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

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

app.use(FileUpload());

app.use(routes);

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
