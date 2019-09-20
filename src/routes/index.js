const router = require("express").Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/anuncios', (req, res) => {
    res.render('anuncios');
});

router.get('/settings', (req, res) => {
    res.render('settings');
});

module.exports = router;