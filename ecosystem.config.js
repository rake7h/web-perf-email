module.exports = {
  apps : [{
    name: "app",
    script: "./server/index.js",
    instances: "max",
    env: {
      NODE_ENV: "production",
    }
  }]
}
