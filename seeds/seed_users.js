/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del();

    const hashedPassword = await bcrypt.hash('password123', 10);

    await knex('users').insert([
        { username: 'admin', password: hashedPassword },
        { username: 'user1', password: hashedPassword },
        { username: 'user2', password: hashedPassword }
    ]);
};