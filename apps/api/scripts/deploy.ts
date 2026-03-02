import { $, chalk } from "zx";

console.log(chalk.blue(`git pull`));
await $`git pull`

console.log(chalk.blue(`bun install`));
await $`bun i --filter apps/api --production`

console.log(chalk.blue(`pm2 reload ecosystem.config.js --update-env`));
await $`pm2 reload ecosystem.config.js --update-env`