'use strict';

const mongoose = require('mongoose')

const anuncioSchema = mongoose.Schema({
    name: String,
    sale: Boolean,
    price: Number,
    image: String,
    tags: [String]
})

// en filters -> name, sale, price y tag
// sort por precio?
anuncioSchema.statics.filter = function(filters, pageNum, elementsToDisplay) {
    const query = Anuncio.find(filters)
    query.skip(pageNum * elementsToDisplay)
    query.limit(elementsToDisplay)
    //console.log(query)
    return query.exec()
}

const Anuncio = mongoose.model('Anuncio', anuncioSchema)
module.exports = Anuncio;