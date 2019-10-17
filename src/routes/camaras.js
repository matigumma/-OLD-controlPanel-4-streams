const router = require("express").Router();
const { isAuthenticated } = require('../helpers/auth');

const Cam = require("../models/Camara");//model

router.get('/camaras', isAuthenticated, async (req, res) => {
    const camaras = await Cam.find().sort({ name: "asc" });
    res.render('camaras/list-cams', {
        camaras, 
        helpers: {
            if_eq: function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            }
        } });
});
router.get('/camaras/add', isAuthenticated, (req, res) => {
    res.render('camaras/add-cam', {
        helpers: {// if_eq del checkbox
            if_eq: function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this); }
        }
    });
});
router.post('/camaras/add', isAuthenticated, async (req, res) => {
    const { name, slug, title, source, ffmpeg, lat, lng } = req.body;
    let { enable, visible} = req.body;
    const errors = [];

    if(!name) errors.push({text: 'Please Insert name'});
    if(!source) errors.push({text: 'Please Insert source'});
    if(errors.length > 0){
        res.render('camaras/add-cam',{
            errors,
            name, slug, title, source, ffmpeg, enable, visible, lat, lng,
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
        const newCam = new Cam({ name, slug, title, source, ffmpeg, enable, visible, lat, lng });

        await newCam.save().catch(err => {
            req.flash('msg_error', 'Error saving to database: '+err); 
            res.render('camaras/add-cam', {
                errors,
                name, slug, title, source, ffmpeg, enable, visible, lat, lng,
                helpers: {
                    if_eq: function (a, b, opts) {
                        if (a == b)
                            return opts.fn(this);
                        else
                            return opts.inverse(this);
                    }
                }
            })
        });
        req.flash('msg_exito', 'Camara agregada!');
        res.redirect('/camaras');
    };
});
router.get('/camaras/edit/:id', isAuthenticated, async (req, res) => {
    const thiscam = await Cam.findById(req.params.id);
    res.render('camaras/cam', { thiscam,
        helpers: {
            if_eq: function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            }
        }
    })
});
router.put('/camaras/edit/:id', isAuthenticated, async (req, res) =>{
    const { name, slug, title, source, ffmpeg, lat, lng } = req.body;
    let { enable, visible } = req.body;
    if (!enable) { enable = "off" };
    if (!visible) { visible = "off" };
    await Cam.findByIdAndUpdate(req.params.id, { name, slug, title, source, ffmpeg, enable, visible, lat, lng});
    req.flash('msg_exito', 'Camara modificada!');
    res.redirect('/camaras');
});
router.delete('/camaras/delete/:id', isAuthenticated, async (req, res) =>{
    await Cam.findByIdAndDelete(req.params.id);
    req.flash('msg_info', 'Camara borrada!');
    res.redirect('/camaras');
})

module.exports = router;