import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modulesでは__dirnameが存在しないため、import.meta.urlから導出する
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initAction() {
    console.log('🔄 initコマンドを実行中...');

    try {
        const sourceDir = path.resolve(__dirname, '../../assets');
        const targetDir = path.join(process.cwd(), '.cursor');

        await fs.cp(sourceDir, targetDir, { recursive: true });

        console.log('✨ アセットのインストールが完了しました！');
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
    }
}
