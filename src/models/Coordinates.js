const mongoose = require('mongoose');

const CoordinatesSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
});

module.exports = CoordinatesSchema;