import { $, argv, chalk } from 'zx'

const SERVER_USER = process.env.SERVER_USER
const SERVER_HOST = process.env.SERVER_HOST
const SERVER_PASSWORD = process.env.SERVER_PASSWORD
const path = '/home/deploy/mcc/current/apps/api/.env'

console.log(chalk.blue(`复制 .env 文件到服务器 ${path}`));
await $`sshpass -p "${SERVER_PASSWORD}" scp .env ${SERVER_USER}@${SERVER_HOST}:/${path}`
