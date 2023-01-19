const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const connectDB = require('./config/db');
connectDB();

const port = process.env.PORT || 5000;

app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use('/', require('./app/routes'));

app.listen(port, () => console.log(`Server started on port ${port}`));
