const mongoose = require("mongoose");
const { Schema } = mongoose;

const CamSchema = new Schema({
    name: { type: String, required: true},
    slug: { type: String, required: true},
    title: { type: String, required: true},
    source: { type: String, required: true},
    ffmpeg: { type: String },
    enable: { type: String },
    visible: { type: String },
    status: { type: Boolean, default: false },
    lat: { type: String },
    lng: { type: String },
    ciudad: { type: String },
    pais: { type: String },
    gmapLink: { type: String },
    sponsor: { type: Object },//str to obj
    banner: { type: String },
    poster: { type: Object },//str to obj
    preroll: { type: Object },//str to obj
    topad: { type: Object },//str to obj
    ad1: { type: Object },//str to obj {name, link, file}
    ad2: { type: Object },//str to obj
    ad3: { type: Object },//str to obj
    ad4: { type: Object },//str to obj
    ad5: { type: Object },//str to obj
    ad6: { type: Object },//str to obj
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Cam', CamSchema);