const router = require("express").Router();

const Cam = require("../models/Camara");
const Stat = require("../models/Status");

router.get('/api/cameras-list', async (req, res) =>{
    try {
        const list = await Cam.find().sort({ name: "asc" });
        if(list.length>0) {res.send(list)} else {res.status(204).send('Empty list')};
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