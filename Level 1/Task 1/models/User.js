/**
 * User Model
 * Acts as temporary in-memory storage for our onboarding form.
 * In a real application, this would interface with a database like MongoDB or PostgreSQL.
 */

const users = []; // Temporary Data Store

module.exports = {
    // Add a new user to the array
    save: (userData) => {
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date()
        };
        users.push(newUser);
        return newUser;
    },
    
    // Retrieve all users
    findAll: () => {
        return users;
    },

    // Retrieve last created user
    findLatest: () => {
        return users.length > 0 ? users[users.length - 1] : null;
    }
};
