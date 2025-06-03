import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    // Inserts seed entries
    await knex("tasks").insert([
        { title: "Learn Fastify", completed: true },
        { title: "Build a cool app", completed: false }
    ]);
};
