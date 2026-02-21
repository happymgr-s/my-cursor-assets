#!/usr/bin/env node

import { cac } from 'cac';
import { initAction } from './commands/init.js';
import { listAction } from './commands/list.js';
import { addAction } from './commands/add.js';
import { prAction } from './commands/pr.js';

const cli = cac('cursor-assets');

cli.command('init', '全てのアセットをインストールする').action(initAction);
cli.command('list', 'アセットの一覧を表示する').alias('ls').action(listAction);
cli.command('add <asset-type> [asset-name]', 'アセットを追加する').action(addAction);
cli.command('pr [asset-type] [asset-name]', 'このリポジトリに向けてPRを作成する').action(prAction);

cli.help();
cli.parse();
