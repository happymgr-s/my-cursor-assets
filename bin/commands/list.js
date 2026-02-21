import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modulesでは__dirnameが存在しないため、import.meta.urlから導出する
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function listAction() {
    console.log('📦 利用可能なアセット一覧:\n');

    const types = ['rules', 'skills', 'agents'];

    for (const type of types) {
        const globalDir = path.resolve(__dirname, '../../assets', type, 'global');

        try {
            await fs.access(globalDir);

            console.log(`[ ${type} ]`);

            // フォルダ内を再帰的に探索して全ファイルを取得する内部関数
            async function getFiles(dir, relativePath = '') {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                let files = [];
                for (const entry of entries) {
                    const resPath = path.resolve(dir, entry.name);
                    const relPath = path.join(relativePath, entry.name);
                    if (entry.isDirectory()) {
                        files = files.concat(await getFiles(resPath, relPath));
                    } else {
                        files.push({ name: entry.name, relPath });
                    }
                }
                return files;
            }

            const allFiles = await getFiles(globalDir);

            if (type === 'rules') {
                const rules = allFiles.filter((f) => f.name.endsWith('.mdc'));
                if (rules.length === 0) console.log('  (アセットがありません)');
                rules.forEach((f) => console.log(`  - ${f.relPath}`));
            } else if (type === 'agents') {
                const agents = allFiles.filter((f) => f.name.endsWith('.md'));
                if (agents.length === 0) console.log('  (アセットがありません)');
                agents.forEach((f) => console.log(`  - ${f.relPath}`));
            } else if (type === 'skills') {
                const skills = allFiles
                    .filter((f) => f.name === 'SKILL.md')
                    .map((f) => path.dirname(f.relPath));

                if (skills.length === 0) console.log('  (アセットがありません)');
                skills.forEach((dir) => console.log(`  - ${dir}`));
            }

            console.log(''); // 見やすくするための空行
        } catch (error) {
            console.log(`[ ${type} ]\n  (ディレクトリがありません)\n`);
        }
    }
}
