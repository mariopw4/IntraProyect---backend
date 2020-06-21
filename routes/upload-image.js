const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const Usuario = require('../models/usuario');

app.use(fileUpload({
    useTempFiles: true
        /* tempFileDir : '/tmp/' */
}));

//==============================
// Subida de imágenes
//==============================
app.put('/upload/:coleccion/:id', (req, res) => {
    let coleccion = req.params.coleccion;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Debe seleccionar alguna imagen'
            }
        });
    }

    //Obteniendo la extensión
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //Validando las extensiones permitidas
    let extensionesValidas = ['jpg', 'jpeg', 'gif', 'png'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        })
    }

    //Creando el nombre personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    let path = `./uploads/${coleccion}/${nombreArchivo}`;

    //Mover archivo del temp a un path en el server
    archivo.mv(path, (err) => {
        if (err) {
            eliminarArchivo(coleccion, nombreArchivo);
            return res.status(500).json({
                ok: false,
                err,
                message: 'Error al subir archivo'
            });
        }

        subir(coleccion, id, nombreArchivo, res);
    });

});

//==================================================
// Determinar la colección que se debe actualizar
//==================================================
function subir(coleccion, id, nombreArchivo, res) {
    if (coleccion === 'usuario') {
        Usuario.findById(id, (err, usuario) => {
            if (err) {
                eliminarArchivo(coleccion, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err,
                    message: 'No existe un usuario con ese ID en la base de datos'
                });
            }

            if (!usuario) {
                eliminarArchivo(coleccion, nombreArchivo);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe un usuario con ese ID en la base de datos'
                    }
                });
            }

            if (usuario.img) {
                eliminarArchivo(coleccion, usuario.img);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuario) => {
                if (err) {
                    eliminarArchivo(coleccion, nombreArchivo);
                    return res.status(500).json({
                        ok: false,
                        err,
                        message: 'No existe un usuario con ese ID en la base de datos'
                    });
                }

                usuario.password = 'Confidencial';
                res.json({
                    ok: true,
                    usuario
                });
            });
        });
    }
}

//================================
// Eliminar un archivo existente
//================================
function eliminarArchivo(coleccion, nombreArchivo) {
    let path = `./uploads/${coleccion}/${nombreArchivo}`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}


module.exports = app;