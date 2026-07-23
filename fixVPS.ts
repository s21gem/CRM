import { Client } from 'ssh2';

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
    // We need to set NODE_ENV=production
    await runCommand('cd /var/www/CRM && pm2 stop crm && pm2 delete crm || true');
    await runCommand('cd /var/www/CRM && export NODE_ENV=production && pm2 start npm --name "crm" -- run start');
    await runCommand('pm2 save');
    console.log('FIX COMPLETE!');
  } catch (err) {
    console.error(err);
  } finally {
    conn.end();
  }
}).connect({
  host: '72.60.202.195',
  port: 22,
  username: 'root',
  password: 'LumasTowfiq@456'
});
