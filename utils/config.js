require('dotenv').config();

let mongoUrl = process.env.mongoUrl;

module.exports = mongoUrl;