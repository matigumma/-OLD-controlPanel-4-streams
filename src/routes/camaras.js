const router = require("express").Router();
const path = require("path");
const multer = require('multer');
const uuid = require('uuid/v4');

//multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/content'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname).toLowerCase());
    }
})

const multerManager = multer({
    storage,
    dest: path.join(__dirname, '../public/content'),
    limits: {fileSize: 10000000},
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if(mimetype && extname){
            return cb(null, true);
        }
        cb("Error: formato de archivo no soportado, debe ser jpeg, jpg, png o gif");
    }
}).fields([ 
    {  name: 'poster'}, 
    {  name: 'preroll'},
    {  name: 'sponsor'},
    {  name: 'ad1'},
    {  name: 'ad2'},
    {  name: 'ad3'},
    {  name: 'ad4'},
    {  name: 'ad5'},
    {  name: 'ad6'}
])

const ifeqHelper = {
    if_eq: function (a, b, opts) {
        if (a == b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    }
}

const { isAuthenticated } = require('../helpers/auth');

const Cam = require("../models/Camara");//model

router.get('/camaras', isAuthenticated, async (req, res) => {
    const camaras = await Cam.find().sort({ name: "asc" });
    res.render('camaras/list-cams', {
        camaras, 
        helpers: ifeqHelper 
    });
});
router.get('/camaras/add', isAuthenticated, (req, res) => {
    res.render('camaras/add-cam', {
        helpers: ifeqHelper
    });
});
router.post('/camaras/add',multerManager, isAuthenticated, async (req, res) => {
    const { name, slug, title, source, ffmpeg, lat, lng } = req.body;
    let { enable, visible} = req.body;
    const errors = [];
    //console.log(req.files);

    if(!name) errors.push({text: 'Please Insert name'});
    if(!source) errors.push({text: 'Please Insert source'});
    if(errors.length > 0){
        res.render('camaras/add-cam',{
            errors,
            name, slug, title, source, ffmpeg, enable, visible, lat, lng,
            helpers: ifeqHelper
        })
    }else{
        if(!enable){enable="off"};
        if(!visible){visible="off"};
        let poster, preroll, sponsor, ad1, ad2, ad3, ad4, ad5, ad6;
        if(req.files.poster){ poster = req.files.poster[0].filename;}
        if(req.files.preroll){ preroll = req.files.preroll[0].filename;}
        if(req.files.sponsor){ sponsor = req.files.sponsor[0].filename;}
        if(req.files.ad1){ ad1 = req.files.ad1[0].filename;}
        if(req.files.ad2){ ad2 = req.files.ad2[0].filename;}
        if(req.files.ad3){ ad3 = req.files.ad3[0].filename;}
        if(req.files.ad4){ ad4 = req.files.ad4[0].filename;}
        if(req.files.ad5){ ad5 = req.files.ad5[0].filename;}
        if(req.files.ad6){ ad6 = req.files.ad6[0].filename;}
    //console.log(req.files);
        const newCam = new Cam({ name, slug, title, source, ffmpeg, enable, visible, lat, lng, poster, preroll, sponsor, ad1, ad2, ad3, ad4, ad5, ad6 });

        await newCam.save().catch(err => {
            req.flash('msg_error', 'Error saving to database: '+err); 
            res.render('camaras/add-cam', {
                errors,
                name, slug, title, source, ffmpeg, enable, visible, lat, lng,
                helpers: ifeqHelper
            })
        }).then((e)=>{
            req.flash('msg_exito', 'Camara agregada!');
            res.redirect('/camaras');
        });
    };
});
router.get('/camaras/edit/:id', isAuthenticated, async (req, res) => {
    const thiscam = await Cam.findById(req.params.id);
    res.render('camaras/cam', { thiscam,
        helpers: ifeqHelper
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