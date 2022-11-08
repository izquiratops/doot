const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

function formatSize(sizeInBytes) {
    if (sizeInBytes > 1024 * 1024) {
        return `${((sizeInBytes / 1024) * 1024).toFixed(3)}Mb`;
    } else if (sizeInBytes > 1024) {
        return `${(sizeInBytes / 1024).toFixed(3)}kb`;
    } else {
        return `${sizeInBytes}b`;
    }
}

function copyFile(src, dest) {
    const { size } = fs.statSync(src);
    console.log(`${src}\t\t${formatSize(size)}`);

    fs.copyFileSync(src, dest);
}

function copyRecursiveSync(src, dest) {
    const isDirectory = fs.existsSync(src) && fs.statSync(src).isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        fs.readdirSync(src).forEach((dir) => {
            const childSrc = path.join(src, dir);
            const childDest = path.join(dest, dir);
            copyRecursiveSync(childSrc, childDest);
        });
    } else {
        if (path.basename(src) !== '.gitkeep') {
            copyFile(src, dest);
        }
    }
}

(() => {
    const result = esbuild.buildSync({
        entryPoints: ['./src/main.ts'],
        outdir: 'dist',
        bundle: true,
        minify: false,
        format: 'esm',
        metafile: true,
    });

    console.log('ESBuild report', esbuild.analyzeMetafileSync(result.metafile));

    copyRecursiveSync('./src/assets', './dist/assets');

    fs.copyFileSync('./src/index.html', './dist/index.html');
    fs.copyFileSync('./src/style.css', './dist/style.css');
})();
