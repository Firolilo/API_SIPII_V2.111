const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://jhair:alas15987@34.28.246.100:27017/alas_chiquitanas?authSource=admin', {
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
