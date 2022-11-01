const fs = require('fs');
const esbuild = require('esbuild');

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

    fs.copyFileSync('./src/index.html', './dist/index.html');
    fs.copyFileSync('./src/style.css', './dist/style.css');
})();
