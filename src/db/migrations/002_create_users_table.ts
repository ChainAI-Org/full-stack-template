import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.timestamps(true, true); // Creates created_at and updated_at
  });

  // Modify tasks table to add user_id
  await knex.schema.alterTable('tasks', (table) => {
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  // First remove the foreign key from tasks
  await knex.schema.alterTable('tasks', (table) => {
    table.dropColumn('user_id');
  });

  // Then drop the users table
  await knex.schema.dropTable('users');
}
