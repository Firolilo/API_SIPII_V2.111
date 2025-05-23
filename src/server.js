require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FireRiskData = require('./models/FireRiskData');
const User = require('./models/User');

// Importaciones mejoradas con manejo de errores
let typeDefs, resolvers;
try {
    typeDefs = require('./graphql/schemas/fireRiskDataSchema');
    resolvers = require('./graphql/resolvers/fireRiskDataResolver');
} catch (e) {
    console.error('❌ Error cargando esquemas/resolvers:', e);
    process.exit(1);
}

// Conexión a MongoDB con mejores opciones
mongoose.connect('mongodb://127.0.0.1:27017/fireRiskDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})
    .then(async () => {
        console.log('✅ Conectado a MongoDB exitosamente');
        try {
            await createAdminUser();
        } catch (e) {
            console.error('❌ Error creando usuario admin:', e);
        }
    })
    .catch((err) => {
        console.error('❌ Error de conexión a MongoDB:', err);
        process.exit(1); // Sale si no puede conectar a MongoDB
    });

async function createAdminUser() {
    const adminData = {
        nombre: 'ADMIN',
        apellido: 'SISTEMA',
        email: 'admin@example.com',
        ci: '0000000',
        password: 'ADMIN',
        telefono: '0000000000',
        isAdmin: true
    };

    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
        await User.create(adminData);
        console.log('👑 Usuario ADMIN creado');
    } else {
        console.log('ℹ Usuario ADMIN ya existe');
    }
}

async function startApolloServer() {
    const app = express();

    // Configuración mejorada de CORS
    app.use(cors({
        origin: '*', // Permite temporalmente todos los orígenes
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Middleware de prueba mejorado
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            graphql: '/graphql'
        });
    });

    // Configuración Apollo Server con manejo de errores
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ FireRiskData, User }),
        playground: true,
        introspection: true,
        debug: true // Habilita mensajes de depuración
    });

    try {
        await server.start();
        server.applyMiddleware({ app, path: '/graphql' });

        const PORT = process.env.PORT || 4000;
        const httpServer = app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`🔍 GraphQL en http://localhost:${PORT}${server.graphqlPath}`);
        });

        // Manejo de errores del servidor HTTP
        httpServer.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Puerto ${PORT} en uso. Prueba con otro puerto.`);
            } else {
                console.error('❌ Error del servidor:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Error iniciando Apollo Server:', error);
        process.exit(1);
    }
}

startApolloServer();