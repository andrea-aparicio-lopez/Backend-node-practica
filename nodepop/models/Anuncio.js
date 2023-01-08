'use strict';

const mongoose = require('mongoose')

// Encontrar la manera de validar los tags desde el esquema
// const tagSchema = mongoose.Schema({
//     type: String,
//     enum: {
//         values: ["work", "lifestyle", "mobile", "motor"],
//         message: '{VALUE} is not valid'
//     }
// })

const anuncioSchema = mongoose.Schema({
    name: String,
    sale: Boolean,
    price: Number,
    image: String,
    tags: [String],
}, 
{versionKey: false}
)


anuncioSchema.statics.filter = function(filters, pageNum, elementsToDisplay, sortByPrice) {
    const query = Anuncio.find(filters)
    query.skip(pageNum * elementsToDisplay)
    query.limit(elementsToDisplay)
    query.sort({price: sortByPrice})
    //console.log(query)
    return query.exec()
}

const Anuncio = mongoose.model('Anuncio', anuncioSchema)
module.exports = Anuncio;