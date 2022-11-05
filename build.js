const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const copyRecursiveSync = (src, dest) => {
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
        fs.copyFileSync(src, dest);
    }
};

(() => {
    const result = esbuild.buildSync({
        entryPoints: ['./src/main.ts'],
        outdir: 'dist',
        bundle: true,
        minify: true,
        format: 'esm',
        metafile: true,
    });

    console.log('ESBuild report', esbuild.analyzeMetafileSync(result.metafile));

    copyRecursiveSync('./src/assets', './dist/assets');
    fs.copyFileSync('./src/index.html', './dist/index.html');
    fs.copyFileSync('./src/style.css', './dist/style.css');
})();
