// scripts/move-dist.mjs
import { cp } from 'fs/promises';
import { join } from 'path';

const source = join(process.cwd(), 'dist', 'silenceongrimpe', 'browser');
const dest = join(process.cwd(), 'dist', 'silenceongrimpe');

async function moveDist() {
  try {
    await cp(source, dest, { recursive: true });
    console.log('✅ Fichiers déplacés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du déplacement des fichiers:', error);
    process.exit(1);
  }
}

moveDist();
