const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    ci: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    state: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Pendiente'],
        default: 'Pendiente'
    },
    entidad_perteneciente: {
        type: String,
        enum: ['Policia', 'Servicios Medicos', 'Defensa Civil', 'Bombero', 'Veterinario'],
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);