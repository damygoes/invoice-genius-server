import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const devDbUrl = process.env.DEV_DATABASE_URL;
const prodDbUrl = process.env.PROD_DATABASE_URL;

const dbURI = NODE_ENV === 'development' ? devDbUrl : prodDbUrl;

if (!devDbUrl || !prodDbUrl) {
    throw new Error('Database URL is not set');
}

if (NODE_ENV === 'development' && !devDbUrl) {
    throw new Error('Database URL is not set');
}

if (NODE_ENV === 'production' && !prodDbUrl) {
    throw new Error('Database URL is not set');
}


export default {
    NODE_ENV,
    dbURI
}