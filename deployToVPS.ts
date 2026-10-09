import { Client } from 'ssh2';
import 'dotenv/config';
import fs from 'fs';

const conn = new Client();

const runCommand = (cmd) => new Promise((resolve, reject) => {
  console.log(`Executing: ${cmd}`);
  conn.exec(cmd, (err, stream) => {
    if (err) return reject(err);
    stream.on('close', (code, signal) => {
      resolve(code);
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
});

const uploadFile = (sftp, localPath, remotePath) => new Promise((resolve, reject) => {
  console.log(`Uploading ${localPath} to ${remotePath}...`);
  sftp.fastPut(localPath, remotePath, (err) => {
    if (err) return reject(err);
    console.log(`Uploaded ${localPath} successfully.`);
    resolve();
  });
});

conn.on('ready', async () => {
  console.log('SSH Connection ready.');
  try {
    // 1. Upload files
    conn.sftp(async (err, sftp) => {
      if (err) throw err;
      
      try {
        await uploadFile(sftp, 'setup_vps.sh', '/root/setup_vps.sh');
        
        // Ensure scripts are executable
        await runCommand('chmod +x /root/setup_vps.sh');
        
        // Execute setup script
        const setupCode = await runCommand('/root/setup_vps.sh');
        if (setupCode !== 0) throw new Error("Setup script failed!");
        
        // Upload db dump and restore script to /var/www/CRM
        await uploadFile(sftp, 'db_dump.json', '/var/www/CRM/db_dump.json');
        await uploadFile(sftp, 'restoreDb.ts', '/var/www/CRM/restoreDb.ts');
        
        // Execute restore script inside the CRM folder
        console.log('Restoring database...');
        await runCommand('cd /var/www/CRM && npx tsx restoreDb.ts');
        
        // Start server with PM2
        console.log('Starting PM2...');
        await runCommand('cd /var/www/CRM && pm2 start npm --name "crm" -- start');
        await runCommand('pm2 save');
        
        console.log('DEPLOYMENT COMPLETE!');
        conn.end();
      } catch (e) {
        console.error(e);
        conn.end();
      }
    });
  } catch (err) {
    console.error(err);
    conn.end();
  }
}).connect({
  host: process.env.VPS_HOST,
  port: 22,
  username: process.env.VPS_USER || 'root',
  password: process.env.VPS_PASSWORD
});
