const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{value} no es un rol permitido'
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es un campo requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es un campo requerido']
    },
    password: {
        type: String,
        required: [true, 'El password es un campo requerido']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    img: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'Error, campo {PATH} tiene que ser único.' });
module.exports = mongoose.model('Usuario', usuarioSchema);