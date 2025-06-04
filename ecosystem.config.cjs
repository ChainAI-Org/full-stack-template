module.exports = {
        apps: [
            {
            name: "npm",
            script: "npm",
            args: "run dev -- --host 0.0.0.0 --port 3000",
            max_restarts: 5,  // Auto-restart up to 5 times if the process crashes
            restart_delay: 5000, // Wait 5s before restarting
            },
        ],
    };