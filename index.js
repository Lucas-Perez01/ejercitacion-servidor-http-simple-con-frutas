const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Leer frutas desde archivo JSON
function leerFrutas() {
  const ruta = path.join(__dirname, 'frutas.json');
  const data = fs.readFileSync(ruta, 'utf-8');
  return JSON.parse(data);
}

const servidor = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { pathname } = url.parse(req.url);
  const partes = pathname.split('/').filter(Boolean); // elimina elementos vacíos

  const frutas = leerFrutas();

  if (pathname === '/') {
    res.statusCode = 200;
    return res.end(JSON.stringify({ mensaje: '¡Bienvenido a la API de Frutas!' }));
  }

  if (pathname === '/frutas/all') {
    res.statusCode = 200;
    return res.end(JSON.stringify(frutas));
  }

  if (partes[0] === 'frutas' && partes[1] === 'id') {
    const id = parseInt(partes[2], 10);
    if (isNaN(id)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'ID inválido' }));
    }
    const fruta = frutas.find(f => f.id === id);
    if (!fruta) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: `Fruta con ID ${id} no encontrada` }));
    }
    res.statusCode = 200;
    return res.end(JSON.stringify(fruta));
  }

  if (partes[0] === 'frutas' && partes[1] === 'nombre') {
    const nombre = decodeURIComponent(partes[2]).toLowerCase();
    const resultado = frutas.filter(f => f.nombre.toLowerCase().includes(nombre));
    res.statusCode = 200;
    return res.end(JSON.stringify(resultado));
  }

  if (partes[0] === 'frutas' && partes[1] === 'existe') {
    const nombre = decodeURIComponent(partes[2]).toLowerCase();
    const existe = frutas.some(f => f.nombre.toLowerCase() === nombre);
    res.statusCode = 200;
    return res.end(JSON.stringify({ nombre, existe }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

const PUERTO = 3000;
servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}/`);
});