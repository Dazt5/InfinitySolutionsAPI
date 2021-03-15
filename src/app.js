/*MONGODB*/ 
require('./config/db');
/*DEFAULT USER MIDDLEWARE*/ 
require('./middlewares/createDefaultAdmin');

/*IMPORTS */
const express = require('express');
require('dotenv').config({ path: '.env' });
const cors = require('cors');
const helmet = require('helmet');

/*- Import router -*/
const router = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());

/*public folders*/
app.use(express.static('./uploads'));

/*ROUTES*/
app.use(router());

/*SERVER*/
const port = process.env.PORT || 5001;

const host = process.env.HOST || '127.0.0.1';

app.listen(port, host, () => {

  console.log(`Development Server in http://${host}:${port}`);

});

