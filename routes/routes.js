const express = require('express');
const app = express();

app.use(require('./upload-image'));
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./images'));

module.exports = app;