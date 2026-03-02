import { $, argv, chalk } from 'zx'

const SERVER_USER = process.env.SERVER_USER
const SERVER_HOST = process.env.SERVER_HOST
const SERVER_PASSWORD = process.env.SERVER_PASSWORD
const path = '/home/deploy/mcc/current/apps/api'

// console.log(chalk.blue(`复制 .env 文件到服务器 ${path}`));
// await $`sshpass -p "${SERVER_PASSWORD}" scp .env ${SERVER_USER}@${SERVER_HOST}:/${path}/.env`

console.log(chalk.blue(`bun install`));
await $`sshpass -p "${SERVER_PASSWORD}" ssh ${SERVER_USER}@${SERVER_HOST} 'export PATH="/home/deploy/.bun/bin:/home/deploy/.nvm/versions/node/v24.11.1/bin:$PATH" && cd ${path} && git pull && scripts/post-deploy.sh'`
