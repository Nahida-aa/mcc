import { $, chalk, echo } from "zx";

console.log(chalk.blue(`bun i --filter apps/api --production`));
const p = $`bun i --filter apps/api --production`
for await (const chunk of p.stdout) {
  echo(chunk)
}
console.log(chalk.green(`installation complete!`));