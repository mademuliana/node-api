module.exports = {
    development: {
        client: 'mysql2', // Ensure mysql2 is installed
        connection: {
            host: '127.0.0.1', // Change if using a remote database
            user: 'root', // Your MySQL username
            password: '', // Your MySQL password
            database: 'expressapi',
            charset: 'utf8mb4'
        },
        migrations: {
            directory: './migrations' // Ensure this folder exists
        },
        seeds: {
            directory: './seeds' // Optional: For seeding data
        }
    }
};