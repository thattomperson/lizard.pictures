import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import url from "rollup-plugin-url"
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
// import html from 'rollup-plugin-bundle-html';

const dev = process.env.ROLLUP_WATCH

export default {
  input: 'src/main.ts',
  output: {
    dir: 'public',
    format: 'iife'
  },
  plugins: [
    typescript(),
    resolve({
      browser: true,
    }),
    url(),
    dev && serve('public'),
    dev && livereload(),
    // html({
    //   template: 'src/template.html',
    //   filename: 'index.html',
    //   absolute: true,
    // })
  ]
};