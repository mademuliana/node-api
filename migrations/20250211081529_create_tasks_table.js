exports.up = function(knex) {
    return knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.boolean('checked').defaultTo(false);
        table.integer('todo_list_id').unsigned().notNullable()
            .references('id').inTable('todo_lists')
            .onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks');
};