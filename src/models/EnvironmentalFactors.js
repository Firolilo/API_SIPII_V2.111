const mongoose = require('mongoose');

const EnvironmentalFactorsSchema = new mongoose.Schema({
    droughtIndex: { type: Number },
    vegetationType: { type: String },
    vegetationDryness: { type: Number },
    humanActivityIndex: { type: Number },
    regionalFactor: { type: Number },
});

module.exports = EnvironmentalFactorsSchema;
