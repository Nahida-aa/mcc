import { $, chalk, echo } from "zx";

console.log(chalk.blue(`git pull`))
const p1 = $`git pull`;
for await (const chunk of p1.stdout) {
  echo(chunk)
}

console.log(chalk.blue(`bun i --filter apps/api --production`));
const p2 = $`bun i --filter apps/api --production`;
for await (const chunk of p2.stdout) {
  echo(chunk)
}

console.log(chalk.blue(`pm2 reload ecosystem.config.js --update-env`));
const p3 = $`pm2 reload ecosystem.config.js --update-env`
for await (const chunk of p3.stdout) {
  echo(chunk)
}