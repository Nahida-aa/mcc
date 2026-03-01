import { $, argv, chalk } from 'zx'
// ssh-to-server.mts
// #!/usr/bin/env bunx zx

const username = process.env.SERVER_USER
const servers: Record<string, string> = {
  prod: `${username}@${process.env.SERVER_HOST}`,
  staging: 'deploy@staging.yourdomain.com',
};

const env = argv._[0] || 'prod';
const host = servers[env];

if (!host) {
  console.error(`未知环境: ${env}`);
  process.exit(1);
}

console.log(chalk.blue(`连接到 ${env.toUpperCase()} 服务器: ${host}`));

// await $`ssh -i ~/.ssh/id_ed25519 ${host}`;
await $`ssh -t ${host}`; // -t 强制分配伪终端（force pseudo-terminal allocation）
// Pseudo-terminal will not be allocated because stdin is not a terminal.