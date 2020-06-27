//Requires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');

//Express init
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Enable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//Routes
app.use(require('./routes/routes'));

//Database connection
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/intraproyectdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Base de datos: ' + colors.green('ONLINE')))
    .catch(err => console.log('Error en la conexión a la BD: ', err));

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});