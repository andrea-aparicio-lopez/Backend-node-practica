'use strict';

const express = require('express')
const createError = require('http-errors')
const Anuncio = require('../../models/Anuncio')

const router = express.Router()

// GET api/anuncios
router.get('/', async (req, res, next) => {
    try {
       const name = req.query.name;     // api/anuncios?name=<name>
       const sale = req.query.sale;     // api/anuncios?sale=<sale>
       const maxPrice = req.query.maxPrice;      // api/anuncios?maxPrice=<number>
       const minPrice = req.query.minPrice;      // api/anuncios?minPrice=<number>
       const tags = req.query.tags;      // api/anuncios?tags=<tagName>
       
       const pageNum = req.query.nPage;                // api/anuncios?nPage=<number>
       const elementsToDisplay = req.query.nElements;  // api/anuncios?nElements=<number>

       const filters = {}
       if(name) {
        filters.name = name
       }
       if(sale) {
        filters.sale = sale
       }

       if(maxPrice && !minPrice) {
            filters.price = { '$lte': maxPrice }
       }else if(!maxPrice && minPrice) {
            filters.price = { '$gte': minPrice }
       }else if(maxPrice && minPrice){
            filters.price = { '$gte': minPrice, '$lte': maxPrice }
       }

       if(tags){
        filters.tags = { '$in': tags }
       }
       console.log(filters)

       const anuncios = await Anuncio.filter(filters, pageNum, elementsToDisplay)
       res.json({results: anuncios}) 
       
    }catch(err) {
        next(err)
    }
})


// GET /api/anuncios/{id}
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const anuncio = await Anuncio.findById(id)
        res.json({result: anuncio})
        
    }catch(err) {
        next(err)
    }
})


// POST /api/anuncios
router.post('/', async (req, res, next) => {
    try{
        const anuncioData = req.body;
        const anuncio = new Anuncio(anuncioData)
        await anuncio.save()

        res.json({result : anuncio})

    }catch(err) {
        next(err)
    }
})


// PUT /api/anuncios/{id}
router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const anuncioData = req.body;

        const anuncioUpdated = await Anuncio.findByIdAndUpdate(id, anuncioData, {new: true });

        res.json({result: anuncioUpdated})

    }catch(err) {
        next(err)
    }
})


// DELETE    /api/anuncios/{id}
router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        // const anuncio = await Anuncio.findByIdAndDelete(id)
        const anuncio = await Anuncio.findById(id)
        if(!anuncio){
            return next(createError(404))
        }
        await Anuncio.findByIdAndDelete(id)
        
        res.json({deleted: anuncio})

    }catch(err) {
        next(err)
    }
})




module.exports = router;