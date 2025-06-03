export async function seed(knex) {
    await knex("tasks").insert([
        { title: "Learn Fastify", completed: true },
        { title: "Build a cool app", completed: false }
    ]);
}
;
//# sourceMappingURL=initial_tasks.js.map