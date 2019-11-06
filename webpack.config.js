const path = require('path');
const fs = require('fs')


module.exports = function (env, argv) {
  const production = argv.mode === 'production'
  
  return {
    name: 'lizard.pictures',
    entry: './src/main.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
              happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
          }
        },
        {
          test: /\.(png|je?pg|gif)$/i,
          use: 'file-loader'
        }
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: production ? 'bundle.[contenthash].js' : 'bundle.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/'
    },
    optimization: {
      usedExports: true,
      mangleExports: true,
    },
    plugins: [
      new HtmlPlugin('./src/index.html')
    ]
  }
};


class HtmlPlugin {
  constructor(template) {
    this.template = template
      
  }

  apply(compiler) {
    const template = path.join(compiler.context, this.template)

    if (!fs.existsSync(template)) {
      throw Error('template dosn\'t  exist');
    }

    // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
    compiler.hooks.emit.tapAsync('HtmlPlugin', (compilation, callback) => {
      compilation.fileDependencies.add(template);
      // Create a header string for the generated file:
      
      var scripts = [];
      var files = compilation.entrypoints.get('main').getFiles()
      for (let index = 0; index < files.length; index++) {
        scripts.push(`<script src="/${files[index]}"></script>`)
      }
      
      fs.readFile(this.template, function (err, buf) {
        var b = buf.toString()
        var i = b.indexOf('</body>')

        var source = b.slice(0, i) + scripts.join('\n') + b.slice(i)
        
  
        // Insert this list into the webpack build as a new file asset:
        compilation.assets['index.html'] = {
          source: function() {
            return source;
          },
          size: function() {
            return source.length;
          }
        };
  
        callback();
      })
    });
  }
}
