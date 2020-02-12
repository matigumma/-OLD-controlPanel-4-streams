const router = require("express").Router();

const Ad = require("../models/Ads");
const Cam = require("../models/Camara");
const Stat = require("../models/Status");

router.get('/api/anuncios-cameras-list', async (req, res) =>{
    try {
        const anuncios = await Ad.find();
        if(anuncios.length>0) {
            console.log('anuncios ok');
            res.status(200).send(anuncios);
        } else {
            console.log('anuncios empty');
            res.status(204).send('Empty list');
        }
    } catch (e) {
        res.status(404).send('Error handling db');
    }
});

router.get('/api/cameras-list', async (req, res) =>{
    try {
        const list = await Cam.find().select('name slug title lat lng ciudad pais gmapLink banner poster preroll sponsor ad1 ad2 ad3 ad4 ad5 ad6 ');
        if(list.length>0) {
            console.log(list);
            res.status(200).send(list);
        } else {
            console.log('cameras-list empty');
            res.status(204).send('Empty list');
        }
    } catch (e) {
        res.status(404).send('Error handling db');
    }
});



//el siguiente get es para corroborar el slug de la camara
router.get('/api/cameras/:any', async (req, res) => {
    try {
        console.log(req.params.any);
        const camara = await Cam.findOne({'slug': req.params.any});
        if (camara) { res.send(camara) } else { res.status(204).send('cam not found') };
    } catch (e) {
        res.status(404).send('Error handling db');
    }
});

router.get('/api/cameras/:id', async (req, res) => {
    try {
        const camara = await Cam.findById(req.params.id);
        if (camara.length > 0) { res.send(camara) } else { res.status(204).send('Camara not found') };
    } catch (e) {
        res.status(404).send('Error handling db');
    }
});

router.get('/api/streams-list', async (req, res) =>{
    try {
        const list = await Cam.find().select('name source ffmpeg enable');
        if(list.length>0) {
            res.status(200).json(list);
        } else {
            res.status(204);
        }
    } catch (e) {
        res.status(404).send('Error handling db');
    }
});

//status para los resstreamers
router.get('/api/status-list', async (req, res) => {
    try {
        const list = await Stat.find().sort({ name: "asc" });
        if (list.length > 0) { res.send(list) } else { res.status(204).send('Empty list') };
    } catch (e) {
        res.status(404).send('Error handling db');
    }
});

router.get('/api/status/:id', async (req, res) => {
    try {
        const camara = await Stat.findById(req.params.id);
        if (camara.length > 0) { res.send(camara) } else { res.status(204).send('Camara not found') };
    } catch (e) {
        res.status(404).send('Error handling db');
    }
});

router.post('/api/status/add', async (req, res) => {
    console.log("status add ", req.body.camara);
    const { restreamer, camara, status, pid } = req.body;
    const newStat = new Stat({ restreamer, camara, status, pid });
    try {
        const statusOk = await newStat.save();
        res.send(statusOk);
    } catch (error) {
        res.status(404).send('Error handling db');
    }
});

module.exports = router;