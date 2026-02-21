import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';

const REPO_URL = 'https://github.com/happymgr-s/my-cursor-assets.git';
const REPO_NAME = 'happymgr-s/my-cursor-assets';

export async function prAction(assetType, assetName) {
    console.log('🚀 PR作成プロセスを開始します...');

    try {
        // 1. gh コマンドがインストールされているかチェック
        try {
            execSync('gh --version', { stdio: 'ignore' });
        } catch (e) {
            console.error(
                '❌ エラー: GitHub CLI (gh) が見つかりません。インストールとログイン(gh auth login)をお願いします。',
            );
            return;
        }

        // 2. 一時ディレクトリを作成してclone
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cursor-assets-'));
        console.log('📦 中央リポジトリを一時取得しています...');
        execSync(`git clone ${REPO_URL} ${tmpDir}`, { stdio: 'ignore' });

        // 3. ローカルの変更を一時ディレクトリにコピー
        const localBaseDir = path.join(process.cwd(), '.cursor');
        const tmpAssetsDir = path.join(tmpDir, 'assets');

        if (assetType && assetName) {
            const sourcePath = path.join(localBaseDir, assetType, 'global', assetName);
            const targetPath = path.join(tmpAssetsDir, assetType, 'global', assetName);
            const stats = await fs.stat(sourcePath);
            if (stats.isDirectory()) {
                await fs.cp(sourcePath, targetPath, { recursive: true });
            } else {
                await fs.mkdir(path.dirname(targetPath), { recursive: true });
                await fs.copyFile(sourcePath, targetPath);
            }
        } else if (assetType) {
            const sourcePath = path.join(localBaseDir, assetType, 'global');
            const targetPath = path.join(tmpAssetsDir, assetType, 'global');
            await fs.cp(sourcePath, targetPath, { recursive: true });
        } else {
            const assetType = ['rules', 'skills', 'agents'];
            for (const t of assetType) {
                const sourcePath = path.join(localBaseDir, t, 'global');
                const targetPath = path.join(tmpAssetsDir, t, 'global');
                try {
                    await fs.access(sourcePath);
                    await fs.cp(sourcePath, targetPath, { recursive: true });
                } catch (e) {
                    // ローカルにその種別のフォルダが無い場合はスキップ
                }
            }
        }

        // 4. Git操作とPR作成 (一時ディレクトリ内で実行)
        const branchName = `update-assets-${Date.now()}`;

        console.log('⚙️ 変更をコミットしています...');
        execSync(`git checkout -b ${branchName}`, { cwd: tmpDir, stdio: 'ignore' });
        execSync(`git add .`, { cwd: tmpDir, stdio: 'ignore' });

        // 変更があるか確認
        const status = execSync(`git status --porcelain`, { cwd: tmpDir }).toString();
        if (!status) {
            console.log('ℹ️ アセットに変更がないため、PRの作成をスキップしました。');
            return;
        }

        execSync(`git commit -m "Update cursor assets: ${assetType || 'all'}"`, {
            cwd: tmpDir,
            stdio: 'ignore',
        });

        console.log('☁️ リポジトリへPushしています...');
        execSync(`git push origin ${branchName}`, { cwd: tmpDir, stdio: 'ignore' });

        console.log('📝 Pull Requestを作成しています...');
        execSync(
            `gh pr create --repo ${REPO_NAME} --title "Update assets: ${assetType || 'all'}" --body "ローカルで更新されたアセットの同期です"`,
            { cwd: tmpDir, stdio: 'inherit' },
        );

        console.log('\n✨ PRの作成が完了しました！');
    } catch (error) {
        console.error('\n❌ エラーが発生しました。詳細:');
        console.error(error.message);
    }
}
