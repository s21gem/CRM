import { Client } from 'ssh2';
import 'dotenv/config';

const conn = new Client();

const runCommand = (cmd: string) => new Promise((resolve, reject) => {
  console.log(`Executing: ${cmd}`);
  conn.exec(cmd, (err, stream) => {
    if (err) return reject(err);
    stream.on('close', (code) => resolve(code))
          .on('data', (data) => process.stdout.write(data))
          .stderr.on('data', (data) => process.stderr.write(data));
  });
});

conn.on('ready', async () => {
  console.log('SSH Connection ready.');
  try {
    await runCommand('cd /var/www/CRM && rm db_dump.json restoreDb.ts');
    await runCommand('cd /var/www/CRM && git pull origin main');
    await runCommand('cd /var/www/CRM && npm run build');
    await runCommand('cd /var/www/CRM && pm2 restart crm');
    console.log('RESTART COMPLETE!');
  } catch (err) {
    console.error(err);
  } finally {
    conn.end();
  }
}).connect({
  host: process.env.VPS_HOST || '72.60.202.195',
  port: 22,
  username: process.env.VPS_USER || 'root',
  password: process.env.VPS_PASSWORD
});
