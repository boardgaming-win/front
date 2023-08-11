module.exports = {
    apps: [
      {
        name: "next-app",
        script: "node_modules/next/dist/bin/next",
        args: "start --port 3000",
        instances: 1,
        exec_mode: "cluster",
      },
    ],
};