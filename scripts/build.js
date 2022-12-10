'use strict';

const { spawn } = require('child_process');
const { writeFileSync, unlinkSync, existsSync } = require('fs');
const { join } = require('path');

const spawnAsync = function(...cmd) {
    return new Promise((resolve) => {
        const child = spawn('npx', [...cmd], {
            stdio: [0, 1, 2],
        });
        child.on('exit', () => {
            resolve();
        });
    });
};

const exec = async function() {
    await spawnAsync('tsc');

    const list = [
        {
            src: './dev/message.js',
            dist: './dist/message.js',
        },
    ];

    for (const item of list) {
        await spawnAsync(
            'esbuild',
            './dev/message.js',
            '--platform=node',
            '--external:./node_modules/*',
            '--bundle',
            '--minify',
            `--outfile=${item.dist}`,
        );
    }

    const dtsFile = join(__dirname, '../dist/message.d.ts');
    if (existsSync(dtsFile)) {
        unlinkSync(dtsFile);
    }
    writeFileSync(dtsFile, `export * from '../dev/message';`);
};

exec();
