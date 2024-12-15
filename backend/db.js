const mongoose = require('mongoose');

mongoose.connect('YOUR_MONGODB_URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = db;