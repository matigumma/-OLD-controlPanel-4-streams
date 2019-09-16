const router = require("express").Router();

router.get('/anuncios/', (req, res) => {
    res.send('Anuncios');
});


module.exports = router;