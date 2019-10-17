const mongoose = require("mongoose");
const { Schema } = mongoose;

const StatSchema = new Schema({
    restreamer: { type: String, required: true },
    camara: { type: String, required: true },
    status: { type: String, required: true },
    pid: { type: String, required: false },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Stat', StatSchema);