'use strict';

const express = require('express')
const Anuncio = require('../../models/Anuncio')

const router = express.Router()

// GET api/anuncios
router.get('/', async (req, res, next) => {
    try {
       const name = req.query.name;
       const sale = req.query.sale;
    //    const price = req.query.price;
       const tags = req.query.tags;
       
        const pageNum = req.query.nPage; // api/anuncios?nPage=<number>
        const elementsToDisplay = req.query.nElements;  // api/anuncios?nElements=<number>

       const filters = {}
       if(name) {
        filters.name = name
       }
       if(sale) {
        filters.sale = sale
       }
    //    if(price){
    //     filters.price = price
    //    }
       if(tags){
        filters.tags = tags
       }
 

       const anuncios = await Anuncio.filter(filters, pageNum, elementsToDisplay)
       res.json({results: anuncios}) 
       
    }catch(err) {
        next(err)
    }
})


// SIN FILTROS

// router.get('/', async (req, res, next) => {
//     try {
//        const anuncios = await Anuncio.find()
//     //    anuncios.exec();
//        res.json({results: anuncios}) 
       
//     }catch(err) {
//         next(err)
//     }
// })






module.exports = router;