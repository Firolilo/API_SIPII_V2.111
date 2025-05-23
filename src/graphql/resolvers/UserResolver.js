const User = require('../../models/User');

const userResolvers = {
    Query: {
        users: async () => await User.find().sort({ createdAt: -1 }),
        user: async (_, { id }) => await User.findById(id),
    },

    Mutation: {
        createUser: async (_, { input }) => {
            const userData = { ...input, isAdmin: input.isAdmin || false };
            const user = new User(userData);
            await user.save();
            return user;
        },

        updateUser: async (_, { id, input }) => {
            return await User.findByIdAndUpdate(id, input, { new: true });
        },

        deleteUser: async (_, { id }) => {
            return await User.findByIdAndDelete(id);
        },

        makeAdmin: async (_, { id }) => {
            return await User.findByIdAndUpdate(
                id,
                { isAdmin: true },
                { new: true }
            );
        }
    }
};

module.exports = userResolvers;