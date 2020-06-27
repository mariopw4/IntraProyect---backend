const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

//==============================
// Obtener imágen 
//==============================
app.get('/img/:coleccion/:img', (req, res) => {
    let coleccion = req.params.coleccion;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../uploads/${coleccion}/${img}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImage);
    }
});


module.exports = app;