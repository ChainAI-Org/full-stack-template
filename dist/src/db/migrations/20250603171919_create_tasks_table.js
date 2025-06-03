export async function up(knex) {
    return knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.boolean('completed').notNullable().defaultTo(false);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}
export async function down(knex) {
    return knex.schema.dropTableIfExists('tasks');
}
//# sourceMappingURL=20250603171919_create_tasks_table.js.map