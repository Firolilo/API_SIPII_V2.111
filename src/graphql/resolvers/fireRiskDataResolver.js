// src/graphql/resolvers/fireRiskDataResolver.js
const { generateFireRiskData } = require('../../utils/randomDataGenerator');

const resolvers = {
    Query: {
        getAllFireRiskData: (_, { count }) => {
            return generateFireRiskData(count);
        },

        getFireRiskDataByLocation: (_, { location, count }) => {
            return generateFireRiskData(count, { location });
        },

        getHighRiskFireData: (_, { threshold, count }) => {
            // Generamos más datos para asegurar obtener los de alto riesgo
            const allData = generateFireRiskData(count * 3);
            return allData
                .filter(item => item.fireRisk >= threshold)
                .slice(0, count)
                .sort((a, b) => b.fireRisk - a.fireRisk);
        },

        getChiquitosFireRiskData: async (_, { count }, { FireRiskData }) => {
            try {
                console.log('Buscando datos en MongoDB...');
                const data = await FireRiskData.find()
                    .sort({ timestamp: -1 })
                    .limit(count || 10)
                    .lean();

                console.log(`Encontrados ${data.length} registros`);
                return data.map(item => ({
                    ...item,
                    id: item._id.toString()
                }));
            } catch (error) {
                console.error('Error al obtener datos de MongoDB:', error);
                // Fallback a datos aleatorios si hay error
                console.log('Generando datos aleatorios como fallback');
                return generateFireRiskData(count, { location: 'San José de Chiquitos' });
            }
        }
    },

    Mutation: {
        deleteFireRiskData: async (_, { id }, { FireRiskData }) => {
            const removed = await FireRiskData.findByIdAndDelete(id);
            return !!removed;          // true si se eliminó
        },
        updateFireRiskName: async (_, { id, name }, { FireRiskData }) => {
            const doc = await FireRiskData.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );
            if (!doc) throw new Error('Registro no encontrado');
            return { id: doc._id.toString(), ...doc.toObject() };
        },

        saveSimulation: async (_, { input }, { FireRiskData }) => {
            try {
                console.log('Guardando simulación:', JSON.stringify(input, null, 2));

                if (!input.initialFires || input.initialFires.length === 0) {
                    throw new Error("Se requieren puntos iniciales de incendio");
                }

                const newSimulation = new FireRiskData({
                    ...input,
                    volunteers: input.volunteers,
                    duration: input.duration,
                    volunteerName: input.volunteerName,
                    environmentalFactors: {
                        droughtIndex: 5,
                        vegetationType: "Forest",
                        vegetationDryness: 80,
                        humanActivityIndex: 3,
                        regionalFactor: 1
                    }
                });

                const saved = await newSimulation.save();
                console.log('Simulación guardada con ID:', saved._id);

                return {
                    id: saved._id.toString(),
                    timestamp: saved.timestamp,
                    location: saved.location,
                    duration: saved.duration,
                    name: saved.name,
                    coordinates: saved.coordinates,
                    weather: saved.weather,
                    fireRisk: saved.fireRisk,
                    fireDetected: saved.fireDetected,
                    parameters: saved.parameters,
                    initialFires: saved.initialFires,
                    environmentalFactors: saved.environmentalFactors
                };
            } catch (error) {
                console.error('Error al guardar la simulación:', error);
                throw new Error(`Error al guardar: ${error.message}`);
            }
        }
    },
};

module.exports = resolvers;