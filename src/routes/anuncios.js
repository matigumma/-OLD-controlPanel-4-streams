const router = require("express").Router();
const path = require("path");
const multer = require('multer');
const uuid = require('uuid/v4');

//multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/content/ads'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname).toLowerCase());
    }
})

const multerManager = multer({
    storage,
    dest: path.join(__dirname, '../public/content/ads'),
    limits: {fileSize: 10000000},
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|mp4/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if(mimetype && extname){
            return cb(null, true);
        }
        cb(`Error: formato de archivo no soportado, debe ser jpeg, jpg, png, gif o mp4 file: ${file.originalname}`,false);
    }
}).fields([ 
    {  name: 'image'}
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

const Ad = require("../models/Ads");//model

//show list ads
router.get('/anuncios', isAuthenticated, async (req, res) => {
    const anuncios = await Ad.find().sort({ pos: "asc" });
    let enable = 'off';
    let today = Date.now;
    if(anuncios.fechaInicio < today && today < anuncios.fechaFin){
        enable = 'on';
    }
    res.render('anuncios/list-ads', {
        anuncios, 
        enable,
        helpers: ifeqHelper 
    })
});

//show add new ad
router.get('/anuncios/add', isAuthenticated, (req, res) => {
    res.render('anuncios/add-ads', {
        helpers: ifeqHelper
    });
});

//post new ads
router.post('/anuncios/add', multerManager, isAuthenticated, async (req, res) => {
    const { title, link, titular, fechaInicio, fechaFin } = req.body;
    const errors = [];

//if(!pos) errors.push({text: 'Please Insert position'});
    if(!link) errors.push({text: 'Please Insert Link'});
    if(!title) errors.push({text: 'Please Insert title'});

    if(errors.length > 0) {
        res.render('anuncios/add-ads', {
            errors,
            title, link, titular, fechaInicio, fechaFin,
            helpers: ifeqHelper
        });
        return;
    } else {
        let image;
        let quant = await Ad.count(function(err, count){
            if(err){
                console.log('quant: null');
                return null;
            }
            console.log('quant: ',count);

            return count;
        });
        const pos = quant;

        if(req.files.image){ image = req.files.image[0].filename; }

        let extras = { titular, fechaInicio, fechaFin };

        const newAd = new Ad({ 
            pos, image, title, link, extras
        });

        await newAd.save().catch(err => {
            req.flash('msg_error', 'Error saving to Database'); 
            res.render('anuncios/add-ads', {
                pos, link, title, titular, fechaInicio, fechaFin, helpers: ifeqHelper });
            return;
        });

        req.flash('msg_exito', 'Anuncio agregado!');
        res.redirect('/anuncios');
    }
});

//show edit ad by id
router.get('/anuncios/edit/:id', isAuthenticated, async (req, res) => {
    const thisad = await Ad.findById(req.params.id);
    console.log(thisad);
    res.render('anuncios/ads', { thisad,
        helpers: ifeqHelper
    })
});

//edit ad
router.put('/anuncios/edit/:id', multerManager, isAuthenticated, async (req, res) =>{
    const { pos, title, link, titular, fechaInicio, fechaFin } = req.body;
    const errors = [];
    
    if(!pos) errors.push({text: 'Please Insert position'});
    if(!link) errors.push({text: 'Please Insert Link'});
    if(!title) errors.push({text: 'Please Insert title'});

    if(errors.length > 0) {
        res.render('anuncios/add-ads', {
            errors,
            pos, title, link, titular, fechaInicio, fechaFin,
            helpers: ifeqHelper
        });
        return;
    }else{

        let image;

        if(req.files.image){ image = req.files.image[0].filename; }
        let extras = { titular, fechaInicio, fechaFin };
    //console.log(req.files);
    /*     const newAd = new Ad({ 
            pos, image, title, link, extras
        }); */
        
        await Ad.findByIdAndUpdate(req.params.id, {pos, image, title, link, extras }).catch(err=>{
            req.flash('msg_error', 'No se pudo actualizar!');
            res.render('anuncios/add-ads',{
                errors,
                pos, title, link, titular, fechaInicio, fechaFin,
                helpers: ifeqHelper
            });
            return;
        });
        req.flash('msg_exito', 'Anuncio modificado!');
        res.redirect('/anuncios');
    }
});

//delete ad
router.delete('/anuncios/delete/:id', isAuthenticated, async (req, res) =>{
    await Ad.findByIdAndDelete(req.params.id);
    req.flash('msg_info', 'Anuncio borrada!');
    res.redirect('/anuncios');
})

module.exports = router;