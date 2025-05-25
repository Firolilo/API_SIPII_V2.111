const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://sipi:sipi123@mongo:27017/alas_chiquitanas?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });g
        console.log('✅ Conectado a MongoDB exitosamente');
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
