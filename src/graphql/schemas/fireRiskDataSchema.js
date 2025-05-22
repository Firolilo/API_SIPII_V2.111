const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Coordinates {
    lat: Float!
    lng: Float!
  }

  input CoordinatesInput {
    lat: Float!
    lng: Float!
  }

  type Weather {
    temperature: Float!
    humidity: Int!
    windSpeed: Float!
    windDirection: Int
    precipitation: Float
    season: String
  }

  input WeatherInput {
    temperature: Float!
    humidity: Int!
    windSpeed: Float!
    windDirection: Int
  }

  type EnvironmentalFactors {
    droughtIndex: Float
    vegetationType: String
    vegetationDryness: Int
    humanActivityIndex: Int
    regionalFactor: Float
  }

  type InitialFire {
    lat: Float!
    lng: Float!
    intensity: Float!
  }

  input InitialFireInput {
    lat: Float!
    lng: Float!
    intensity: Float!
  }

  type SimulationParameters {
    temperature: Float!
    humidity: Float!
    windSpeed: Float!
    windDirection: Float!
    simulationSpeed: Float!
  }

  input SimulationParametersInput {
    temperature: Float!
    humidity: Float!
    windSpeed: Float!
    windDirection: Float!
    simulationSpeed: Float!
  }

  type FireRiskData {
    id: ID!
    timestamp: String!
    location: String!
    duration: Int!  
<<<<<<< HEAD
    volunteers: Int!
    volunteerName: String!
=======
>>>>>>> 9d54ed24c9230d4c0829c50f328b985985c049c3
    name: String
    coordinates: Coordinates!
    weather: Weather!
    environmentalFactors: EnvironmentalFactors!
    fireRisk: Float!
    fireDetected: Boolean!
    initialFires: [InitialFire!]!
    parameters: SimulationParameters
  }

  input SimulationInput {
    timestamp: String!
    location: String!
    duration: Int!
<<<<<<< HEAD
    volunteers: Int!
    volunteerName: String!
=======
>>>>>>> 9d54ed24c9230d4c0829c50f328b985985c049c3
    name: String     
    coordinates: CoordinatesInput!
    weather: WeatherInput!
    parameters: SimulationParametersInput
    fireRisk: Float!
    fireDetected: Boolean!
    initialFires: [InitialFireInput!]!
  }

  type Query {
    getAllFireRiskData(count: Int = 10): [FireRiskData!]!
    getFireRiskDataByLocation(location: String!, count: Int = 5): [FireRiskData!]!
    getHighRiskFireData(threshold: Float = 75, count: Int = 5): [FireRiskData!]!
    getChiquitosFireRiskData(count: Int = 10): [FireRiskData!]!
  }

  type Mutation {
    saveSimulation(input: SimulationInput!): FireRiskData
    deleteFireRiskData(id: ID!): Boolean! 
    updateFireRiskName(id: ID!, name: String!): FireRiskData
  }
`;

module.exports = typeDefs;
