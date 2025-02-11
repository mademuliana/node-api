exports.seed = async function(knex) {
    await knex('tasks').del();

    await knex('tasks').insert([
        { id: 1, name: 'Complete project', checked: false, todo_list_id: 1 },
        { id: 2, name: 'Submit report', checked: true, todo_list_id: 1 },
        { id: 3, name: 'Buy groceries', checked: false, todo_list_id: 2 }
    ]);
};