require('dotenv').config()
// import 'dotenv/config'

module.exports = {
  apps: [{
    name: "api",
    script: "src/index.ts",
    interpreter: "bun", // Bun interpreter
    env: {
      PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
      "NODE_ENV": "production",
    },
    env_production: {
      PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
      "NODE_ENV": "production",
    },
    kill_timeout: 3000,
    wait_ready: true,
    listen_timeout: 10000,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
  }],
  // Deployment Configuration
  deploy: {
    production: {
      "key": "/home/aa/.ssh/id_rsa_custom",
      "user": process.env.SERVER_USER,
      "host": process.env.SERVER_HOST,
      "ref": "origin/main",
      "repo": "git@github.com:Nahida-aa/mcc.git",
      "path": "/home/deploy/mcc",
      "pre-setup": "echo 'commands or local script path to be run on the host before the setup process starts'", // 翻译: 在设置过程开始之前，在主机上运行的命令或本地脚本路径
      "post-setup": "echo 'commands or a script path to be run on the host after cloning the repo'", // 翻译: 在克隆存储库后(设置后)，在主机上运行的命令或脚本路径
      "pre-deploy": "pwd && ls -al apps/api",
      "post-deploy": "cd apps/api && bash ./scripts/post-deploy.sh",
      "pre-deploy-local": "echo 'This is a local executed command'"
    }
  }
}
