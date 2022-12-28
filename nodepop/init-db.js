'use strict';

const readline = require('readline');

const Anuncio = require('./models/Anuncio.js')

async function initAnuncios() {
    //borro anuncios almacenados
    const result = await Anuncio.deleteMany();
    console.log(`Se han borrado ${result.deletedCount} anuncios`);

    // Anuncios iniciales
    const anunciosIniciales = require('./anunciosIniciales.json')
    const inserted = await Anuncio.insertMany(anunciosIniciales)
    console.log(`Creados ${inserted.length} anuncios`)
}

async function main(){
    const proceed = await confirmProceed('¿Borrar base de datos?');
    if(!proceed){
        process.exit();
    }

    const connection = require('./lib/connectMongoose');
    await initAnuncios();
    connection.close();
}

function confirmProceed(question){
    return new Promise((resolve, reject) => {
        const interface = readline.createInterface({
            input: rpocess.stdin,
            output: process.stdout
        });
        interface.question(question, answer => {
            interface.close();
            if(respuesta.toLowerCase() === 'si' || respuesta.toLowerCase() === 'yes' 
            || respuesta.toLowerCase() === 's' || respuesta.toLowerCase() === 'y'){
                resolve(true);
                return;
            }
            resolve(false);
        })
    })
}



main().catch(err => console.log('Error:', err))