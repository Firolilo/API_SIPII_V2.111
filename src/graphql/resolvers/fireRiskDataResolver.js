const FireRiskData = require('../../models/FireRiskData');
const User = require('../../models/User');

const resolvers = {
    // QUERIES
    Query: {
        // FireRiskData queries
        getAllFireRiskData: async (_, { count }) => {
            return await FireRiskData.find().sort({ timestamp: -1 }).limit(count);
        },
        getFireRiskDataByLocation: async (_, { location, count }) => {
            return await FireRiskData.find({ location })
                .sort({ timestamp: -1 })
                .limit(count);
        },
        getHighRiskFireData: async (_, { threshold = 75, count = 5 }) => {
            return await FireRiskData.find({ fireRisk: { $gte: threshold } })
                .sort({ timestamp: -1 })
                .limit(count);
        },
        getChiquitosFireRiskData: async (_, { count = 10 }) => {
            return await FireRiskData.find({ location: 'Chiquitos' })
                .sort({ timestamp: -1 })
                .limit(count);
        },

        // User queries
        users: async () => await User.find().sort({ createdAt: -1 }),
        user: async (_, { id }) => await User.findById(id),
    },

    // MUTATIONS
    Mutation: {
        // FireRiskData mutations
        saveSimulation: async (_, { input }) => {
            try {
                if (!input.initialFires?.length) {
                    throw new Error("Se requieren puntos iniciales de incendio");
                }

                const newSimulation = new FireRiskData({
                    ...input,
                    environmentalFactors: {
                        droughtIndex: 5,
                        vegetationType: "Forest",
                        vegetationDryness: 80,
                        humanActivityIndex: 3,
                        regionalFactor: 1,
                        ...input.environmentalFactors
                    }
                });

                return await newSimulation.save();
            } catch (error) {
                console.error('Error al guardar simulación:', error);
                throw new Error(`Error al guardar: ${error.message}`);
            }
        },

        deleteFireRiskData: async (_, { id }) => {
            const removed = await FireRiskData.findByIdAndDelete(id);
            return !!removed;
        },

        updateFireRiskName: async (_, { id, name }) => {
            const doc = await FireRiskData.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );
            if (!doc) throw new Error('Registro no encontrado');
            return doc;
        },

        // User mutations
        createUser: async (_, { input }) => {
            const user = new User({
                ...input,
                isAdmin: input.isAdmin || false
            });
            return await user.save();
        },

        updateUser: async (_, { id, input }) => {
            return await User.findByIdAndUpdate(id, input, { new: true });
        },

        deleteUser: async (_, { id }) => {
            return await User.findByIdAndDelete(id);
        },

        makeAdmin: async (_, { id }) => {
            return User.findByIdAndUpdate(
                id,
                {isAdmin: true},
                {new: true}
            );
        },

        login: async (_, { ci, password }) => {
            const user = await User.findOne({ ci });
            if (!user) throw new Error('Usuario no encontrado');
            if (password !== user.password) throw new Error('Contraseña incorrecta');
            return { user };
        },

        register: async (_, { input }) => {
            const existingUser = await User.findOne({ ci: input.ci });
            if (existingUser) throw new Error('CI ya registrada');

            // Aquí puedes agregar hashing si quieres (recomendado)
            if (input.nombre === "admin") input.isAdmin = true;
            else input.isAdmin = false;

            const user = new User(input);
            await user.save();
            return user;
        },

        crearUsuarioGlobal: async (_, { input }) => {
            const user = new User({
                ...input,
                isAdmin: true
            });
            return await user.save();
        },
    }
};

module.exports = resolvers;