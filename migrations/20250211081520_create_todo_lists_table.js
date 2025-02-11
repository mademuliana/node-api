exports.up = function(knex) {
    return knex.schema.createTable('todo_lists', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users')
            .onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('todo_lists');
};