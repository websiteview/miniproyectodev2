import path from 'node:path';
import fs from 'node:fs/promises';
import { pool } from './db.js';


export const index = async (req, res) => {

    const ruta = path.resolve('./public/index.html');
    const contenido = await fs.readFile(ruta, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(contenido);
}

export const getUsuarios = async (req, res) => {
    /* con pool.query('SELECT * FROM usuarios') se selecciona la tabla de la base de datos miniproyecto*/
    const resultado = await pool.query('SELECT * FROM usuarios')
    /* miniproyectos es una constante que se puede cambiar por usuarios pero lo deje asi por cuestiones de tiempo */
    const miniproyectos = resultado[0]
    const stringData = JSON.stringify(miniproyectos)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(stringData)
}

export const exportUsuarios = async (req, res) => {
    try {
        /* con pool.query('SELECT * FROM usuarios') se selecciona la tabla de la base de datos miniproyecto*/
        const resultado = await pool.query('SELECT * FROM usuarios')
        /* miniproyectos es una constante que se puede cambiar por usuarios pero lo deje asi por cuestiones de tiempo */
        const miniproyectos = resultado[0]
        //Se obtiene las cabeceras separadas por coma ","
        const cabeceras = Object.keys(miniproyectos[0]).join(',')

        /* await fs.writeFile('usuarios.csv', cabeceras.join(',')) */

        //Obteniendo filas de informacion 'info1, info2, info3'
        const filas = miniproyectos.reduce((acc, usuarios) => {
            const string = `\n${usuarios.ID},${usuarios.NOMBRE},${usuarios.APELLIDO},${usuarios.DIRECCIÓN},${usuarios.CORREO_ELECTRÓNICO},${usuarios.DNI},${usuarios.EDAD},${usuarios.FECHA_CREACIÓN},${usuarios.TELÉFONO}`
            return acc + string
        }, '')
        const contenido = cabeceras + filas

        await fs.writeFile('usuarios.csv', contenido)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Informacion de usuarios exportados a usuarios.csv' }))

    } catch (error) {
        console.log(error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Error interno del servidor' }))

    }

}

export const importUsuarios = async (req, res) => {
    const contenido = await fs.readFile('usuarios.csv', 'utf-8')
    const filas = contenido.split('\n')
    filas.shift(filas)

    for (const fila of filas) {
        const valores = fila.split(',')
        const NOMBRE = valores[1]
        const APELLIDO = valores[2]
        const DIRECCIÓN = valores[3]
        const CORREO_ELECTRÓNICO = valores[4]
        const DNI = valores[5]
        const FECHA_CREACIÓN = valores[6]
        const TELÉFONO = valores[7]

        try {
            await pool.execute('INSERT INTO usuarios(NOMBRE, APELLIDO, DIRECCIÓN, FECHA_CREACIÓN, TELÉFONO) VALUES (?,?,?,?,?,?,?)', [Nombre, Apellido, Direccion, correo_electronico, dni, fecha_creacion, teléfono])
            console.log('Se incertó a: ', NOMBRE)
        } catch (error) {
            if (error.errno === 1062)
                console.log('No se inserto a : ', NOMBRE, 'ID Y CORREO DUPLICADO')
            continue

        }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Datos importados' }))
}
