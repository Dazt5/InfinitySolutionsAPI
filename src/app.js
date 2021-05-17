/*MONGODB*/
require('./config/db');
/*MIDDLEWARES*/
require('./middlewares/createDefaultAdmin');

const notFoundHandler = require('./middlewares/errorHandler/notFoundHandler');

/*IMPORTS */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const socket = require('./libs/socket');
const cors = require('cors');
const helmet = require('helmet');
const { config } = require('./config/index');

/*- Import router -*/
const router = require('./routes/index');
const { logErrors, wrapErrors, errorHandler } = require('./middlewares/errorHandler/errorHandler');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors('*'));
app.use(helmet());

/*public folders*/
app.use(express.static('./src/uploads'));

socket.connect(server);

/*ROUTES*/
app.use(router());

//ERROR MIDDLEWARES
app.use(notFoundHandler);

app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

/*SERVER*/
const port = config.port || 5001;
const host = config.host || '127.0.0.1';

server.listen(port, host, () => {

  console.log(`Development Server in http://${host}:${port}`);

});

