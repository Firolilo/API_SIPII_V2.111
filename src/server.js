require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./graphql/schemas/fireRiskDataSchema');
const resolversModule = require('./graphql/resolvers/fireRiskDataResolver');
const resolvers = resolversModule.default || resolversModule;
const User = require('./models/User');
const FireRiskData = require('./models/FireRiskData');


// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ Conectado a MongoDB');
    
    // Crear usuario ADMIN si no existe
    const adminExists = await User.findOne({ ci: '0000000' });
    if (!adminExists) {
        await User.create({
            nombre: 'ADMIN',
            apellido: 'SISTEMA',
            email: 'admin@example.com',
            ci: '0000000',
            password: 'ADMIN',
            telefono: '0000000000',
            isAdmin: true,
            state: 'Activo'
        });
        console.log('Usuario ADMIN creado');
    }
})
.catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1);
});

async function startServer() {
    const app = express();
    
    // Configuración básica de CORS
    app.use(cors());

    // Configuración Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ FireRiskData, User }),
        playground: true
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();