import npm from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'index.js',
  dest: 'bundle.js',
  format: 'umd',
  moduleName: "d3",
  plugins: [
    npm({ jsnext: true, main: true }),
    //uglify()
  ]
}
