/**
 * Simple in-memory storage for users.
 * In a production app, replace this with a Database (MongoDB, PostgreSQL, etc).
 */
const users = [];

module.exports = {
    save: (userData) => {
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            timestamp: new Date()
        };
        users.push(newUser);
        return newUser;
    },
    getAll: () => users,
    getLatest: () => users[users.length - 1]
};
