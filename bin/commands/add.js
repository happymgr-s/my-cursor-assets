import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modulesでは__dirnameが存在しないため、import.meta.urlから導出する
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function addAction(assetType, assetName) {
    console.log(`➕ addコマンドを実行中...`);

    try {
        const baseSourceDir = path.resolve(__dirname, '../../assets', assetType, 'global');
        const baseTargetDir = path.join(process.cwd(), '.cursor', assetType, 'global');

        if (assetName) {
            const sourcePath = path.join(baseSourceDir, assetName);
            const targetPath = path.join(baseTargetDir, assetName);

            // 対象がファイルかディレクトリかを判定
            const stats = await fs.stat(sourcePath);

            if (stats.isDirectory()) {
                await fs.cp(sourcePath, targetPath, { recursive: true });
                console.log(`✨ ${assetType} のディレクトリ '${assetName}' を追加しました！`);
            } else {
                const targetDir = path.dirname(targetPath);

                await fs.mkdir(targetDir, { recursive: true });

                await fs.copyFile(sourcePath, targetPath);
                console.log(`✨ ${assetType} のファイル '${assetName}' を追加しました！`);
            }
        } else {
            await fs.cp(baseSourceDir, baseTargetDir, { recursive: true });
            console.log(`✨ ${assetType} のアセットを一括追加しました！`);
        }
    } catch (error) {
        console.error(`❌ エラー: 指定されたアセットが見つからないか、コピーに失敗しました。`);
        console.error(`詳細: ${error.message}`);
    }
}
