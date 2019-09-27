const mongoose = require("mongoose");
const { Schema } = mongoose;

const CamSchema = new Schema({
    name: { type: String, required: true},
    source: { type: String, required: true},
    enable: { type: String, required: true},
    visible: { type: String, required: true},
    connected: { type: Object, required: false},//status de la camara //ffprobe data //ping //etc
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Cam', CamSchema, 'cameras');