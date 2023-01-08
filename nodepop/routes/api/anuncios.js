'use strict';

const express = require('express')
const createError = require('http-errors')
const Anuncio = require('../../models/Anuncio')
// const validators = require('../../utils/validators')

// const validateTags = validators.validateTags()
const router = express.Router()

let regexId = /[0-9A-Fa-f]{24}/

// funcion para validar tags. No he conseguido importarla del fichero "validators.js"
function validateTags(tags) {
    const tagList = ["work", "lifestyle", "mobile", "motor"]
    let isValid = true
    tags.forEach(tag => {
        if(isValid && tagList.indexOf(tag) ===-1 ) {
            isValid = false
        }
    });
    return isValid
}



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

       const sortByPrice = req.query.sortByPrice;   // api/anuncios?sortByPrice=<1 ó -1>

       if(!pageNum || !elementsToDisplay){
        return next(createError(400, "Indica la página y nº de elementos a mostrar"))
       }

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
    //    console.log(filters)

       const anuncios = await Anuncio.filter(filters, pageNum, elementsToDisplay, sortByPrice)
       res.json({results: anuncios}) 
       
    }catch(err) {
        next(err)
    }
})


// GET /api/anuncios/{id}
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        // compruebo si el id es válido
        if(!id.match(regexId) || id.length !== 24){
            return next(createError(400))
        }
        const anuncio = await Anuncio.findById(id)
        if(!anuncio){
            return next(createError(404))
        }

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

        // Valido el input
        if(!anuncio.name){
            return next(createError(400, "Requerido: name"))
        }
        if(!anuncio.price){
            return next(createError(400, "Requerido: price"))
        }
        if(!anuncio.sale && anuncio.sale !== false){
            return next(createError(400, "Requerido: sale"))
        }
        if(!anuncio.image){
            anuncio.image = `./images/${anuncio.name.toLowerCase()}.jpg'`
        }
        if(!anuncio.tags){
            return next(createError(400, "Requerido: al menos un tag"))
        }
        if(!validateTags(anuncio.tags)){
            return next(createError(400, "Tags no válidos. Tags permitidos: 'work', 'lifestyle', 'mobile', 'motor'"))
        }

        // Si el input es válido, guardo el anuncio
        await anuncio.save()

        res.json({result : anuncio})

    }catch(err) {
        console.log(err)
        next(err)
    }
})


// PUT /api/anuncios/{id}
router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const anuncioData = req.body;

        // Compruebo si el id es válido. Si no lo es, devuelvo un 400
        if(!id.match(regexId) || id.length !== 24){
            return next(createError(400))
        }

        const anuncioUpdated = await Anuncio.findByIdAndUpdate(id, anuncioData, {new: true });

        // Si no encuentro el anuncio, devuelvo un 404
        if(!anuncioUpdated){
            return next(createError(404))
        }
        res.json({result: anuncioUpdated})

    }catch(err) {
        next(err)
    }
})


// DELETE    /api/anuncios/{id}
router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id

        // Compruebo si el id es válido. Si no lo es, devuelvo un 400
        if(!id.match(regexId) || id.length !== 24){
            return next(createError(400))
        }

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