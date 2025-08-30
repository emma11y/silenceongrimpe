import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distFolder = join(__dirname, 'dist/silenceongrimpe');
const { app } = await import(join(distFolder, 'server/main.mjs'));

export default app;
