import FireRiskData from '../../models/FireRiskData.js';
import User from '../../models/User.js';
import axios from 'axios';

const resolvers = {
    // QUERIES
    Query: {
        // FireRiskData queries
        getAllFireRiskData: async (_, { count }) => {
            return await FireRiskData.find().sort({ timestamp: -1 }).limit(count);
        },
        getAllFireRiskDataAll: async (_) => {
            return await FireRiskData.find().sort({ timestamp: -1 });
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
            return await FireRiskData.find({ location: 'San José de Chiquitos' })
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
            const entidades = ['Policía', 'Servicios Medicos', 'Defensa Civil', 'Bomberos', 'Veterinarios'];

            const entidadAleatoria = entidades[Math.floor(Math.random() * entidades.length)];
            
            const user = new User({
                ...input,
                isAdmin: input.isAdmin || false,
                state: input.state || 'Pendiente',
                entidadPertenciente: entidadAleatoria 
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

            if (!input.password) {
                throw new Error('La contraseña es requerida');
            }

            const isAdmin = input.nombre.toLowerCase() === "admin";
            const user = new User({
                ...input,
                isAdmin,
                state: 'Activo'
            });

            await user.save();

            try {
                await axios.post('http://Global-Api:2020/global_registro/alasB', {
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    ci: user.ci,
                    telefono: user.telefono,
                });
                
                console.log('✅ Usuario registrado en sistema global');
            } catch (error) {
                console.error('❌ Error registrando ADMIN en sistema global:', error.message);
            }

            return user;
        },

        nuevoUsuarioGlobal: async (_, { input }) => {
            
            const user = new User({
                ...input,
                isAdmin: false,
                state: 'Inactivo',
                password: 'temp_password'
            });
            
            console.log(user)

            return await user.save();
        },

        changePassword: async (_, { ci, currentPassword, newPassword }, { User }) => {
            try {
                const existingUser = await User.findOne({ ci });
                if (!existingUser) {
                    throw new Error('Usuario no encontrado');
                }

                if (newPassword.length < 6) {
                    throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
                }

                existingUser.password = newPassword;
                existingUser.state = 'Activo';

                await existingUser.save();

                return {
                    success: true,
                    message: 'Contraseña cambiada exitosamente',
                    user: existingUser
                };

            } catch (error) {
                console.error('Error en changePassword:', error);
                return {
                    success: false,
                    message: error.message,
                    user: null
                };
            }
        }

    }
};

export default resolvers;