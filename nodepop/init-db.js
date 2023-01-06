'use strict';

const readline = require('readline');
const fs = require('fs')

const Anuncio = require('./models/Anuncio.js')

async function initAnuncios() {
    //borro anuncios almacenados
    const result = await Anuncio.deleteMany();
    console.log(`Se han borrado ${result.deletedCount} anuncios`);

    // Cargo los anuncios iniciales
    // const anunciosIniciales = require('./anunciosIniciales.json')
    const anunciosIniciales = JSON.parse(fs.readFileSync('./anunciosIniciales.json', 'utf-8'))
    const inserted = await Anuncio.insertMany(anunciosIniciales)
    console.log(`Creados ${inserted.length} anuncios`)
}

async function main(){
    console.log('Por aqui pasa')
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
            if(answer.toLowerCase() === 'si' || answer.toLowerCase() === 'yes' 
            || answer.toLowerCase() === 's' || answer.toLowerCase() === 'y'){
                resolve(true);
                return;
            }
            resolve(false);
        })
    })
}



main().catch(err => console.log('Error:', err))