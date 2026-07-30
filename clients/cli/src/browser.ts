import { spawn } from 'node:child_process';

export async function openBrowser(url: string): Promise<void> {
  if (process.platform !== 'win32') {
    throw new Error('Opening a browser is supported only on Windows.');
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });

    child.once('error', reject);
    child.once('spawn', () => {
      child.unref();
      resolve();
    });
  });
}
