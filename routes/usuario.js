const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { verificarToken } = require('../middlewares/auth');

//==============================
// Obtener usuarios
//==============================
app.get('/usuario', (req, res) => {
    let desde = Number(req.query.desde) || 0;
    Usuario.find({ estado: true }, 'nombre email role img')
        .limit(5)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                        message: 'Error al contar registros'
                    });
                }

                res.json({
                    ok: true,
                    usuarios,
                    total
                });

            });

        });
});

//==============================
// Crear usuario
//==============================
app.post('/usuario', verificarToken, (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        usuario.password = 'Confidencial';
        res.json({
            ok: true,
            usuario
        });
    });
});

//==============================
// Modificar usuarios
//==============================
app.put('/usuario/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                message: 'Error al buscar usuario'
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe un usuario con ese ID'
                }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.img = body.img;
        usuario.role = body.role;

        usuario.save((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                    message: 'Error al guardar usuario'
                });
            }

            usuario.password = 'Confidencial';
            res.json({
                ok: true,
                usuario
            });
        });
    })
});

//==============================
// Eliminar usuario
//==============================
app.delete('/usuario/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario
        });
    });
});

module.exports = app;