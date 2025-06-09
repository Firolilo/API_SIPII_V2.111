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
    volunteers: Int!
    volunteerName: String!
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
    volunteers: Int!
    volunteerName: String!
    name: String     
    coordinates: CoordinatesInput!
    weather: WeatherInput!
    parameters: SimulationParametersInput
    fireRisk: Float!
    fireDetected: Boolean!
    initialFires: [InitialFireInput!]!
  }

  type User {
      id: ID!
      nombre: String!
      apellido: String!
      email: String!
      ci: String!
      telefono: String
      password: String!
      isAdmin: Boolean!
      state: String!
      createdAt: String!
      entidad_perteneciente: String
  }

  input UserInput {
      nombre: String
      apellido: String
      email: String
      ci: String
      password: String   
      telefono: String
      isAdmin: Boolean
      state: String 
  }

  input inputUsuarioGlobal {
      nombre: String
      apellido: String
      email: String
      ci: String
      telefono: String
  }

  type AuthPayload {
      token: String
      user: User
  }

  type RegisterPayload {
      user: User
  }

  type ChangePasswordResponse {
    success: Boolean!
    message: String!
    user: User
}
  
  type Query {
    getAllFireRiskData(count: Int = 10): [FireRiskData!]!
    getAllFireRiskDataAll: [FireRiskData!]!
    getFireRiskDataByLocation(location: String!, count: Int = 5): [FireRiskData!]!
    getHighRiskFireData(threshold: Float = 75, count: Int = 5): [FireRiskData!]!
    getChiquitosFireRiskData(count: Int = 10): [FireRiskData!]!
    

    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    saveSimulation(input: SimulationInput!): FireRiskData
    deleteFireRiskData(id: ID!): Boolean! 
    updateFireRiskName(id: ID!, name: String!): FireRiskData

    createUser(input: UserInput!): User
      
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User
    makeAdmin(id: ID!): User
      
    login(ci: String!, password: String!): AuthPayload
    register(input: UserInput!): User!
    nuevoUsuarioGlobal(input: inputUsuarioGlobal!): User

    changePassword(ci: String!, currentPassword: String!, newPassword: String!): ChangePasswordResponse!
  }
`;

module.exports = typeDefs;
