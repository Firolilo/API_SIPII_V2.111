const mongoose = require('mongoose');
const CoordinatesSchema = require('./Coordinates');
const WeatherSchema = require('./Weather');
const EnvironmentalFactorsSchema = require('./EnvironmentalFactors');

const FireRiskDataSchema = new mongoose.Schema({
<<<<<<< HEAD

    timestamp: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true },
    volunteers: { type: Number, required: true }, // 👈 Nuevo campo
    volunteerName: { type: String, required: true, default: "" }, // 👈 Nuevo campo

=======
    timestamp: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true },
>>>>>>> 9d54ed24c9230d4c0829c50f328b985985c049c3
    name: { type: String, default: '' },
    coordinates: { type: CoordinatesSchema, required: true },
    weather: { type: WeatherSchema, required: true },

    // ✅ deja SOLO esta definición y quítala de arriba
    environmentalFactors: { type: EnvironmentalFactorsSchema, required: false },

    fireRisk: { type: Number, required: true },
    fireDetected: { type: Boolean, required: true },

    parameters: {
        temperature: Number,
        humidity: Number,
        windSpeed: Number,
        windDirection: Number,
        simulationSpeed: Number
    },

    // pon default [] si quieres que no sea obligatorio
    initialFires: {
        type: [
            {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
                intensity: { type: Number, required: true },
            }
        ],
        default: []
    }
});

module.exports = mongoose.model('FireRiskData', FireRiskDataSchema);
