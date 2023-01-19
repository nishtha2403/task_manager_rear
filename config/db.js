const moongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        const conn = await moongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch(error) {
        console.error('ERROR | connectDB | ', error);
    }
}

module.exports = connectDB;