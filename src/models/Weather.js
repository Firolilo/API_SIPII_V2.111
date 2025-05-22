const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    windDirection: { type: Number },
    precipitation: { type: Number },
    season: { type: String },
});


module.exports = WeatherSchema;
