// src/utils/randomDataGenerator.js

/**
 * Genera datos aleatorios para simular condiciones ambientales en Chiquitos, Santa Cruz
 * @param {number} count - Número de registros a generar
 * @param {Object} options - Opciones para personalizar la generación de datos
 * @returns {Array} - Array de objetos con datos de riesgo de incendio
 */
function generateFireRiskData(count = 1, options = {}) {
    // Ubicaciones específicas de la provincia Chiquitos
    const locations = [
        'Parque Nacional Noel Kempff Mercado',
        'Reserva Natural Valle de Tucavaca',
        'Santiago de Chiquitos',
        'San José de Chiquitos',
        'Roboré',
        'Chochis',
        'Agua Dulce',
        'Pampa Grande',
        'San Juan de Taperas',
        'Santo Corazón'
    ];

    // Épocas del año relevantes para la región
    const seasons = ['época seca', 'época de lluvias', 'transición seca-lluvia', 'transición lluvia-seca'];

    // Tipos de vegetación característicos de Chiquitos
    const vegetationTypes = [
        'bosque chiquitano seco',
        'cerrado',
        'sabana arbustiva',
        'bosque ribereño',
        'palmar'
    ];

    const data = [];

    for (let i = 0; i < count; i++) {
        // Fecha aleatoria en los últimos 2 años
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 730));

        // Ubicación aleatoria en Chiquitos
        const location = options.location || locations[Math.floor(Math.random() * locations.length)];

        // Coordenadas aproximadas de la provincia Chiquitos
        const baseLat = -18.5 + (Math.random() * 2.5); // Entre -18.5° y -16.0°
        const baseLng = -61.5 + (Math.random() * 3.5); // Entre -61.5° y -58.0°

        // Generar datos climáticos típicos de la región
        // Temperatura: más alta en primavera/verano (época seca)
        const tempBase = location.includes('Noel Kempff') ? 25 : 28; // Más fresco en el parque nacional
        const temperature = parseFloat((tempBase + (Math.random() * 15)).toFixed(1)); // 25-40°C en general

        // Humedad: más baja en época seca
        const humidityBase = location.includes('Noel Kempff') ? 50 : 40; // Más húmedo en el parque
        const humidity = Math.floor(humidityBase + (Math.random() * 40)); // 40-80%

        // Velocidad del viento: generalmente baja en la región
        const windSpeed = parseFloat((Math.random() * 20).toFixed(1)); // 0 a 20 km/h

        // Precipitación: varía según época del año
        const precipitation = parseFloat((Math.random() * (location.includes('Noel Kempff') ? 80 : 60)).toFixed(1)); // 0-80mm

        // Factores de riesgo específicos para la región
        const droughtIndex = parseFloat((Math.random() * 8 + 2).toFixed(1)); // 2 a 10 (la región tiene épocas secas marcadas)
        const vegetationDryness = Math.floor(Math.random() * 60 + 30); // 30% a 90% (más seco que otras regiones)
        const humanActivityIndex = Math.floor(Math.random() * 4 + 1); // 1 a 4 (quemas agrícolas comunes)

        // Estación y tipo de vegetación
        const season = seasons[Math.floor(Math.random() * seasons.length)];
        const vegetationType = vegetationTypes[Math.floor(Math.random() * vegetationTypes.length)];

        // Calcular riesgo de incendio (adaptado a las condiciones de Chiquitos)
        const fireRisk = calculateChiquitosFireRisk(
            temperature,
            humidity,
            windSpeed,
            droughtIndex,
            vegetationDryness,
            humanActivityIndex,
            season
        );

        data.push({
            id: options.idPrefix ? `${options.idPrefix}-${i}` : `chq-${Date.now()}-${i}`,
            timestamp: date.toISOString(),
            location,
            coordinates: {
                lat: parseFloat((baseLat + (Math.random() * 0.3 - 0.15)).toFixed(6)), // Variación pequeña alrededor de la ubicación
                lng: parseFloat((baseLng + (Math.random() * 0.3 - 0.15)).toFixed(6)) // Variación pequeña alrededor de la ubicación
            },
            weather: {
                temperature,
                humidity,
                windSpeed,
                windDirection: Math.floor(Math.random() * 360),
                precipitation,
                season
            },
            environmentalFactors: {
                droughtIndex,
                vegetationType,
                vegetationDryness,
                humanActivityIndex,
                regionalFactor: getRegionalFactor(location) // Factor específico por ubicación
            },
            fireRisk,
            fireDetected: fireRisk > 75 ? Math.random() > 0.2 : false // Más probable si riesgo > 75%
        });
    }

    return data;
}

/**
 * Factores regionales específicos para ubicaciones en Chiquitos
 */
function getRegionalFactor(location) {
    const factors = {
        'Parque Nacional Noel Kempff Mercado': 0.7, // Menor riesgo por protección
        'Reserva Natural Valle de Tucavaca': 0.8,
        'Santiago de Chiquitos': 1.1, // Mayor riesgo por actividad humana
        'San José de Chiquitos': 1.2,
        'Roboré': 1.15,
        'Chochis': 1.0,
        'Agua Dulce': 1.05,
        'Pampa Grande': 1.1,
        'San Juan de Taperas': 1.0,
        'Santo Corazón': 1.05
    };
    return factors[location] || 1.0;
}

/**
 * Calcula riesgo de incendio adaptado a las condiciones de Chiquitos
 */
function calculateChiquitosFireRisk(temperature, humidity, windSpeed, droughtIndex, vegetationDryness, humanActivity, season) {
    // Ponderación ajustada para Chiquitos
    const tempWeight = 0.25;
    const humidityWeight = -0.2; // Humedad tiene más impacto negativo en el riesgo
    const windWeight = 0.15; // Vientos generalmente no son tan fuertes
    const droughtWeight = 0.3; // La sequía es factor crítico en la región
    const vegWeight = 0.25;
    const humanWeight = 0.15; // Quemas agrícolas son factor importante
    const seasonWeight = season.includes('seca') ? 0.3 : season.includes('lluvia') ? -0.2 : 0;

    // Normalizar valores
    const tempScore = ((temperature - 20) / 20) * 100; // 20-40°C → 0-100
    const humidityScore = 100 - humidity; // Invertir
    const windScore = (windSpeed / 20) * 100; // 0-20 km/h → 0-100
    const droughtScore = (droughtIndex / 10) * 100;
    const vegScore = vegetationDryness;
    const humanScore = ((humanActivity - 1) / 3) * 100;

    // Calcular riesgo ponderado
    let risk = (
        tempScore * tempWeight +
        humidityScore * humidityWeight +
        windScore * windWeight +
        droughtScore * droughtWeight +
        vegScore * vegWeight +
        humanScore * humanWeight +
        seasonWeight * 100
    );

    // Ajustar por factor regional
    risk = risk * (risk > 0 ? 1.1 : 1); // La región es propensa a incendios

    // Asegurar que esté entre 0 y 100
    risk = Math.max(0, Math.min(100, risk));

    return parseFloat(risk.toFixed(1));
}

module.exports = {
    generateFireRiskData,
    calculateFireRisk: calculateChiquitosFireRisk
};