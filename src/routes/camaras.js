const router = require("express").Router();

router.get('/camaras/', (req, res) => {
    res.send('Camaras');
});

router.get('/camaras/:id', (req, res) => {
    res.send('Camaras',req.param('id'));
});

module.exports = router;