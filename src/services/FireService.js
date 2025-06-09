// FireService.js
const axios = require('axios');
const FireRiskData = require('../models/FireRiskData');

// Configuración
const REPORTES_API_URL = 'http://34.28.246.100:4000/graphql';
const CHECK_INTERVAL = 300000; // 5 minutos (en milisegundos)

// Función para calcular el riesgo basado en la gravedad
function calcularRiesgo(gravedad) {
    switch(gravedad) {
        case 'Leve': return 40;
        case 'Mediano': return 65;
        case 'Grave': return 85;
        default: return 50;
    }
}

// Función principal para verificar y crear nuevos FireRiskData
async function checkAndCreateFireRiskData() {
    try {
        // 1. Obtener todos los reportes
        const response = await axios.post(REPORTES_API_URL, {
            query: `
                query ObtenerReportes {
                    obtenerReportes {
                        id
                        nombre_reportante
                        telefono_contacto
                        fecha_hora
                        nombre_lugar
                        ubicacion {
                            coordinates
                        }
                        tipo_incendio
                        gravedad_incendio
                    }
                }
            `
        });

        const reportes = response.data.data.obtenerReportes;

        // 2. Para cada reporte, verificar si ya existe en FireRiskData
        for (const reporte of reportes) {
            const [lng, lat] = reporte.ubicacion.coordinates;
            
            const existe = await FireRiskData.findOne({
                'coordinates.lat': lat,
                'coordinates.lng': lng
            });

            if (!existe) {

                if(reporte.nombre_lugar === "San Jose de Chiquitos")
                {
                    reporte.nombre_lugar = "San Jose de Chiquitos."
                }
                // 3. Si no existe, crear nuevo FireRiskData
                const volunteers = Math.floor(Math.random() * (50 - 8 + 1)) + 8;
                
                const nuevoFireRisk = new FireRiskData({
                    timestamp: new Date().toISOString(),
                    location: reporte.nombre_lugar || 'Ubicación desconocida',
                    duration: 60,
                    volunteers: volunteers,
                    volunteerName: reporte.nombre_reportante || 'Anónimo',
                    name: `Reporte: ${reporte.tipo_incendio}`,
                    coordinates: {
                        lat: lat,
                        lng: lng
                    },
                    weather: {
                        temperature: 30,
                        humidity: 40,
                        windSpeed: 15,
                        windDirection: 180
                    },
                    environmentalFactors: {
                        droughtIndex: 5,
                        vegetationType: "Forest",
                        vegetationDryness: 80,
                        humanActivityIndex: 3,
                        regionalFactor: 1
                    },
                    fireRisk: calcularRiesgo(reporte.gravedad_incendio),
                    fireDetected: true,
                    initialFires: [{
                        lat: lat,
                        lng: lng,
                        intensity: 50
                    }]
                });

                await nuevoFireRisk.save();
                console.log(`Nuevo FireRiskData creado para reporte ${reporte.id}`);
            }
        }
    } catch (error) {
        console.error('Error en checkAndCreateFireRiskData:', error.message);
    }
}

// Iniciar el servicio periódico
function iniciarServicioVerificacion() {
    // Ejecutar inmediatamente al iniciar
    checkAndCreateFireRiskData();
    
    // Configurar intervalo periódico
    setInterval(checkAndCreateFireRiskData, CHECK_INTERVAL);
    console.log(`Servicio de verificación iniciado. Intervalo: ${CHECK_INTERVAL/1000} segundos`);
}

module.exports = iniciarServicioVerificacion;