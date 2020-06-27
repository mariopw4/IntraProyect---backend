const express = require('express');
const app = express();
const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

module.exports.verificarToken = function(req, res, next) {
    let token = req.get('token');
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded;
        next();
    });
}