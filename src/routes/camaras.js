const router = require("express").Router();

router.get('/camaras/add', (req, res) => {
    res.render('camaras/add-cam');
})

router.get('/camaras/', (req, res) => {
    res.render('camaras');
});

router.get('/camaras/:id', (req, res) => {
    res.send('Camaras',req.param('id'));
});

module.exports = router;