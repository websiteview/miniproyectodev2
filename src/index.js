import http from 'http'
import { PORT } from './config.js'
import {exportUsuarios, getUsuarios, importUsuarios, index } from './controller.js'

const server = http.createServer(async (req, res) => {

    const { url, method } = req;

    if (method === 'GET') {
        switch (url) {
            case '/':
                index(req, res)
                break;

            case '/api/usuarios':
                getUsuarios(req, res)
                break;

            case '/api/usuarios/export':
                exportUsuarios(req, res)
                break;

            case '/api/usuarios/import':
                importUsuarios(req, res)
                break;

            default:
                res.end('Ruta no encontrada');
                break;
        }

    }


    if (method === 'POST') {
        // CODIGO PARA RUTAS EN POST


    }
})

server.listen(PORT, () => console.log('Servidor ejecutandose'))