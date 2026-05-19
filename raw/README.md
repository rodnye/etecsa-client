# Código original parcheado

En esta carpeta se encuentra todo el código Javascript del sitio https://www.tienda.etecsa.cu.

- El archivo `/raw/static/js/main.*.chunk.js` presenta algunas modificaciones para poder realizar la extracción de las funciones necesarias. Al estar compilado con Webpack no son accesibles globalmente.
- La extracción de las funciones se almacenan en la variable `window.extracted = {...}`
- En el archivo `/raw/index.html` fue eliminado todo lo que no fuera Javascript (estilos css, fuentes) ya que no son necesarios para la captura de la API
