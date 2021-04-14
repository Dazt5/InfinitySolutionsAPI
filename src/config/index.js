require('dotenv').config();

const config = {

    dev:process.env.NODE_ENV !== 'production',
    port:process.env.PORT || 3000,
    host:process.env.HOST || '127.0.0.1',
    
    cors: process.env.CORS,
    dbUser: process.env.DB_USER,
    dbPassword:process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbLocal: process.env.NODE_ENV === 'development' ? process.env.DB_LOCAL : false,
    dbLocalName:process.env.NODE_ENV === 'development' ? process.env.DB_LOCAL_NAME : false
}

module.exports = {config}