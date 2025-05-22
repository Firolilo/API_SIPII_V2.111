const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/fireRiskDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Conectado a MongoDB exitosamente');
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
