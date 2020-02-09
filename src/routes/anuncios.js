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
    try {
        const anuncios = await Ad.find().sort({ pos: "asc" });
    /*    let enable = 'off';
        let today = Date.now;
        if(anuncios.fechaInicio < today && today < anuncios.fechaFin){
            enable = 'on';
        } */
        res.render('anuncios/list-ads', {
            anuncios, 
            helpers: ifeqHelper 
        })
    } catch (error) {
        const anuncios = []
        req.flash('msg_error', `Hubo un error al recuperar el listado de anuncios!: ${error}`);
        res.render('anuncios/list-ads', {
            anuncios, 
            helpers: ifeqHelper 
        })
    }
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
        let image, pos;
        try {
            let quant = await Ad.count(function(err, count){
                if(err){
                    console.log('quant: null');
                    return null;
                }
                console.log('quant: ',count);
                return count;
            });
            pos = quant;
        } catch (error) {
            req.flash('msg_error', 'Error saving to Database, pos.count l.93'); 
            res.render('anuncios/add-ads', {
                pos, link, title, titular, fechaInicio, fechaFin, helpers: ifeqHelper });
            return;
        }

        if(req.files.image){ image = req.files.image[0].filename; }

        let extras = { titular, fechaInicio, fechaFin };

        const newAd = new Ad({ 
            pos, image, title, link, extras
        });
        try {
            await newAd.save()
        } catch (error) {
            req.flash('msg_error', 'Error saving to Database, newAd.save() l.117'); 
            res.render('anuncios/add-ads', {
                pos, link, title, titular, fechaInicio, fechaFin, helpers: ifeqHelper });
            return;
        }
        req.flash('msg_exito', 'Anuncio agregado!');
        res.redirect('/anuncios');
    }
});

//show edit ad by id
router.get('/anuncios/edit/:id', isAuthenticated, async (req, res) => {
    let thisad
    try {
        thisad = await Ad.findById(req.params.id);
    } catch (error) {
        req.flash('msg_error', `Error while try to get Ad data, Ad.findById() l.133 : ${error}`); 
        res.render('anuncios/list-ads', { thisad,
            helpers: ifeqHelper
        })
        return;
    }
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
        let objetoNuevo = {}
        objetoNuevo.pos = pos
        objetoNuevo.title = title
        objetoNuevo.link = link
        objetoNuevo.extras = { titular, fechaInicio, fechaFin };
        req.files.image[0].filename ? objetoNuevo.image = req.files.image[0].filename : objetoNuevo.image = ''

        try {
            await Ad.findByIdAndUpdate(req.params.id, objetoNuevo)
        } catch (error) {
            req.flash('msg_error', `No se pudo actualizar!, error l.173: ${error}`);
            res.render('anuncios/add-ads',{
                errors,
                pos, title, link, titular, fechaInicio, fechaFin,
                helpers: ifeqHelper
            });
            return;
        }
        req.flash('msg_exito', 'Anuncio modificado!');
        res.redirect('/anuncios');
    }
});

//delete ad
router.delete('/anuncios/delete/:id', isAuthenticated, async (req, res) =>{
    try {
        await Ad.findByIdAndDelete(req.params.id)
    } catch (error) {
        req.flash('msg_error', `Error al intentar borrar el anuncio l.191: ${error}`);
        res.redirect('/anuncios');
        return;
    }
    req.flash('msg_info', 'Anuncio borrada!');
    res.redirect('/anuncios');
})

module.exports = router;