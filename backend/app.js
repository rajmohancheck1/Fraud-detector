const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.use(express.json());

mongoose.connect('YOUR_MONGODB_URI', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/', routes);
app.listen(3000, () => console.log('Server running on port 3000'));