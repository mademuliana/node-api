exports.seed = async function(knex) {
    await knex('todo_lists').del();

    await knex('todo_lists').insert([
        { id: 1, name: 'Work Tasks', user_id: 2 },
        { id: 2, name: 'Personal Tasks', user_id: 3 }
    ]);
};