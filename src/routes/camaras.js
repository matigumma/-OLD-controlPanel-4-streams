const router = require("express").Router();

const Cam = require("../models/Camara");


router.get('/camaras/add', (req, res) => {
    res.render('camaras/add-cam');
})
router.post('/camaras/add/new', (req, res) => {
    const { name, source} = req.body;
    let { enable, visible } = req.body;
    const errors = [];
    if(!name){
        errors.push({text: 'Insert name'});
    }
    if(!source){
        errors.push({text: 'Insert source'});
    }
    if(errors.length > 0){
        res.render('camaras/add-cam',{
            errors,
            name,
            source
        })
    }else{
        if(!enable){enable="off"};
        if(!visible){visible="off"};
        const newCam = new Cam({name, source, enable, visible});
        console.log(newCam);
        res.send('ok');
    }
})
router.get('/camaras/', (req, res) => {
    res.render('camaras');
});

router.get('/camaras/:id', (req, res) => {
    res.send('Camaras',req.param('id'));
});

module.exports = router;