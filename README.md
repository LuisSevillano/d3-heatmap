Steps to use **rollup.js**:
- run `npm init`   
- run `npm install --save-dev rollup`   
- run `npm install --save-dev rollup-plugin-node-resolve`
- run `touch index.js index.html`   
- Referenciamos `bundle.js` en nuestro `html`   
- run `touch rollup.config.js`
- editamos `package.json`  
- Creamos una nueva propiedad dentro de `scripts`: `"install": "rollup -c"` (esta propiedad será ejecutada cuando corramos `npm install`)  
- En `rollup.config.js` escribimos:   
 ```javascript
 import npm from 'rollup-plugin-node-resolve';

 export default {
    entry: 'index.js',
    dest: 'bundle.js',
    format: 'umd',
    moduleName: "d3",
    plugins: [
      npm({ jsnext: true, main: true })
    ]
 }
 ```
- Instalamos _browser-sync_ : `npm install --save-dev browser-sync`.   
- Creamos una propiedad en _package.json_ : `"start": "browser-sync start --no-notify --server --files '*.html,*.js' & rollup -c -w"`.   
Esta propiedad se ejecutará cuando corramos `npm start`:  

  - lanza _browser-sync_ sin notificaciones
  - crea un _listener_ sobre todos los
  - ejecuta _rollup -c_   


- Instalamos _rollup-watch_: `npm install --save-dev rollup-watch`

### Caso práctico
**Mapa de EEUU**   
- instalamos las dependencias necesarias: `npm install --save-dev d3-geo d3-scale topojson-client...`   
- Creamos una carpeta `modules`. En esta carpeta podemos alojar todos los js con funciones correspondientes como por ejempo `map.js`.    
En este _js_ han de ser importados todos los **módulos** necesarios:
```javascript
import { select } from "d3-selection"
import { geoPath } from "d3-geo"
import { feature, mesh } from "topojson-client"
...
```
La función **map** es nombrada de la siguiente manera:
```javascript
export default function(args){...}
```
- Es en `index.js` donde _nombramos_ a esta función como queramos. Puede recibir argumentos:
```javascript
import makeMap from "./modules/map.js"
makeMap(args);
```
