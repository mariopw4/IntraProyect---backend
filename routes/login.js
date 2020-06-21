const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const Usuario = require('../models/usuario');

//==============================
// Login de usuario
//==============================
app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario o la constraseña están incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario o la constraseña están incorrectos'
                }
            });
        }

        //Generando jsonwebtoken
        let token = jwt.sign({ usuario }, SEED, { expiresIn: '24h' });

        usuario.password = 'Confidecial';
        res.json({
            ok: true,
            usuario,
            token
        });

    });
});

module.exports = app;