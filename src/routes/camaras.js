const router = require("express").Router();

const Cam = require("../models/Camara");
var titulop = "";

router.get('/camaras/add', (req, res) => {
    res.render('camaras/add-cam', {
        helpers: {
            if_eq: function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this); }
        }
    });
})
router.post('/camaras/add/new', async (req, res) => {
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
            source,
            enable,
            visible,
            helpers: {
                if_eq: function (a, b, opts) {
                    if (a == b)
                        return opts.fn(this);
                    else
                        return opts.inverse(this);
                }
            }
        })
    }else{
        if(!enable){enable="off"};
        if(!visible){visible="off"};
        const newCam = new Cam({name, source, enable, visible});
        //console.log(newCam);
        await newCam.save();
        res.redirect('/camaras/list');
    };
});
router.get('/camaras', (req, res) => {
    res.render('camaras');
});

router.get('/camaras/edit/:id', (req, res) => {
    res.render('camaras/cam');
});

router.get('/camaras/list', async (req, res) => {
    const camaras = await Cam.find().sort({date: "desc"});
    titulop = "Camaras";
    res.render('camaras/list-cams', { camaras, titulop });
});

module.exports = router;