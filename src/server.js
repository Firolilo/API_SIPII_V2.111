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
<<<<<<< HEAD

=======
        const count = await FireRiskData.countDocuments();

        // Solo insertamos un documento si la colección está vacía
        if (count === 0) {
            const exampleData = new FireRiskData({
                timestamp: "2025-04-25T00:00:00Z",
                location: "San José de Chiquitos",
                coordinates: { lat: -17.8, lng: -61.5 },
                weather: {
                    temperature: 30,
                    humidity: 65,
                    windSpeed: 5,
                    windDirection: 90,
                    precipitation: 0,
                    season: "Dry"
                },
                environmentalFactors: {
                    droughtIndex: 5,
                    vegetationType: "Forest",
                    vegetationDryness: 80,
                    humanActivityIndex: 3,
                    regionalFactor: 1
                },
                parameters: {
                    temperature: 30,
                    humidity: 65,
                    windSpeed: 5,
                    windDirection: 90,
                    simulationSpeed: 1
                },
                initialFires: [
                    { lat: -17.82, lng: -61.52, intensity: 1 }
                ],
                fireRisk: 80,
                fireDetected: true
            });

            await exampleData.save();
            console.log('📄 Documento de ejemplo insertado en la base de datos.');
        }
>>>>>>> 9d54ed24c9230d4c0829c50f328b985985c049c3
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