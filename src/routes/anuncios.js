const router = require("express").Router();

router.get('/anuncios/', (req, res) => {
    var titulop = "Anuncios";
    res.send('Anuncios',{ titulop });
});


module.exports = router;