require('dotenv').config()
// import 'dotenv/config'

console.log(process.env.SERVER_HOST);

module.exports = {
  apps : [{
    name   : "api",
    script : "src/index.ts",
    interpreter: "bun", // Bun interpreter
    env: {
      PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
       "NODE_ENV": "production",
    },
            env_production: {
            PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
            "NODE_ENV": "production",
        },
    kill_timeout : 3000,
     wait_ready: true,
     listen_timeout: 10000,
     log_date_format: 'YYYY-MM-DD HH:mm Z',
  }],
    // Deployment Configuration
  deploy : {
    production : {
      "user" : process.env.USER,
      "host" : process.env.SERVER_HOST,
      "ref"  : "origin/main",
      "repo" : "git@github.com:Nahida-aa/mcc.git",
      "path" : "/home/deploy/mcc",
      "post-deploy" : "bun install"
    }
  }
}
