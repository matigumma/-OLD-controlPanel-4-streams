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
    lat: { type: String },
    lng: { type: String },
    gmapLink: { type: String },
    sponsor: { type: String },
    banner: { type: String },
    poster: { type: String },
    preroll: { type: String },
    topad: { type: String },
    ad1: { type: String },
    ad2: { type: String },
    ad3: { type: String },
    ad4: { type: String },
    ad5: { type: String },
    ad6: { type: String },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Cam', CamSchema);