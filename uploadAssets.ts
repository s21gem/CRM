import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const conn = new Client();
const UPLOADS_DIR = path.join(process.cwd(), 'server', 'public', 'uploads');

const uploadFile = (sftp: any, localPath: string, remotePath: string) => {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localPath, remotePath, (err: any) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

const createDir = (sftp: any, remotePath: string) => {
  return new Promise((resolve) => {
    sftp.mkdir(remotePath, (err: any) => {
      resolve(true); // ignore errors if it exists
    });
  });
};

conn.on('ready', () => {
  console.log('SSH Connection ready.');
  conn.sftp(async (err, sftp) => {
    if (err) throw err;
    try {
      console.log('Creating /var/www/CRM/server/public/uploads ...');
      await createDir(sftp, '/var/www/CRM/server/public');
      await createDir(sftp, '/var/www/CRM/server/public/uploads');
      
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const file of files) {
        const localPath = path.join(UPLOADS_DIR, file);
        if (fs.statSync(localPath).isFile()) {
          console.log(`Uploading ${file}...`);
          await uploadFile(sftp, localPath, `/var/www/CRM/server/public/uploads/${file}`);
        }
      }
      console.log('Uploads transferred successfully.');
      
      // Need to restart pm2 to serve new files? Actually express.static picks up dynamically!
      // But let's restart just in case.
      conn.exec('pm2 restart crm', (err, stream) => {
        stream.on('close', () => conn.end());
      });
      
    } catch (e) {
      console.error(e);
      conn.end();
    }
  });
}).connect({
  host: '72.60.202.195',
  port: 22,
  username: 'root',
  password: 'LumasTowfiq@456'
});
