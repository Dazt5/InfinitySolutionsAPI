/*MONGODB*/
require('./config/db');
/*MIDDLEWARES*/
require('./middlewares/createDefaultAdmin');

const notFoundHandler = require('./middlewares/notFoundHandler');

/*IMPORTS */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const {config} = require('./config/index');

/*- Import router -*/
const router = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());

/*public folders*/
app.use(express.static('./src/uploads'));

/*ROUTES*/
app.use(router());

app.use(notFoundHandler);



/*SERVER*/
const port = config.port || 5001;
const host = config.host || '127.0.0.1';

app.listen(port, host, () => {

  console.log(`Development Server in http://${host}:${port}`);

});

