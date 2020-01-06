const mongoose = require("mongoose");
const { Schema } = mongoose;
//anuncio {pos,image,title,link,extra{titular, f.creacion, f.inicio, f.fin, clicks }}
const AdSchema = new Schema({
    pos: { type: String, required: true},
    image: { type: String, required: true},
    title: { type: String, required: true},
    link: { type: String, required: true},
    extra: {
        titular: { type: String },
        fechaCreacion: { type: Date, default: Date.now },
        fechaInicio: { type: Date },
        fechaFin: { type: Date },
        clicks: { type: Number, default: 0}
    }
})

module.exports = mongoose.model('Ad', AdSchema);