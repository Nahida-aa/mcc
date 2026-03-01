module.exports = {
  apps : [{
    name   : "api",
    script : "src/index.ts",
    interpreter: "bun", // Bun interpreter
    env: {
      PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
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
      "user" : "deploy",
      "host" : "8.141.3.89",
      "ref"  : "origin/main",
      "repo" : "git@github.com:Nahida-aa/repository.git",
      "path" : "/var/www/my-repository",
      "post-deploy" : "npm install"
    }
  }
}
