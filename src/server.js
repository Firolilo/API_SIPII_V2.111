require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FireRiskData = require('./models/FireRiskData'); // Importa el modelo
const typeDefs = require('./graphql/schemas/fireRiskDataSchema');
const resolvers = require('./graphql/resolvers/fireRiskDataResolver');

// Asegurar que el modelo FireRiskData está disponible globalmente
global.FireRiskData = FireRiskData;

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/fireRiskDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Conectado a MongoDB exitosamente');
        // Insertar un documento de ejemplo si la colección está vacía
        insertInitialData();
    })
    .catch((err) => {
        console.error('❌ Error al conectar a MongoDB:', err);
    });

async function insertInitialData() {
    try {
    } catch (error) {
        console.error('❌ Error al insertar los datos iniciales: ', error);
    }
}

async function startApolloServer() {
    const app = express();

    // Configurar CORS
    app.use(cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Agrega aquí los orígenes permitidos
        credentials: true
    }));

    // Middleware para parsear JSON
    app.use(express.json());

    // Agregar un endpoint de prueba
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', message: 'Server is running' });
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ FireRiskData }), // Pasar FireRiskData como parte del contexto
        playground: true, // Siempre activar playground para depuración
        introspection: true, // Permitir introspección
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor GraphQL corriendo en http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🔍 GraphQL Playground disponible en http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startApolloServer();