import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import pug2svelte from 'pug2svelte'
import sass from 'sass';
import path from 'path';
import fs from 'fs'
const production = !process.env.ROLLUP_WATCH;

sass.render({ file: "./src/style/global.sass" }, (err, res) =>
  fs.writeFileSync("./public/global.css", res.css)
)

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins: [
    require("rollup-plugin-sass")(),
    require("rollup-plugin-scss")(),
    svelte({
      preprocess: {
        markup: ({ content, filename }) => {
          if (path.extname(filename) == ".pug") {
            let html = pug2svelte(content, { pug: true, pretty: true })
            content = html
            .replace(/=&gt;/g, "=>")
            .replace(/&quot;/g, '"')
            // console.log(html)
          }
          return { code: content }
        },
        style: ({ content, filename }) => {
          const isScss = /;/.test(content)
          const { css, map, stats } = sass.renderSync({
            data: content,
            indentedSyntax: !isScss,
            includePaths: [
              path.dirname(filename)
            ]
          })
          return { code: css.toString(), map }
        },
      },
      extensions: ['.pug', '.svelte', '.html'],
      dev: !production,
      emitCss: true,
      css: css => {
        css.write('public/bundle.css');
      }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),
    !production && livereload('public'),
    production && terser()
  ],
  watch: {
    clearScreen: false,
    chokidar: {
      usePolling: true,
    },
  }
};
