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
        const fileTypes = /jpeg|jpg|png|gif|mp4/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if(mimetype && extname){
            return cb(null, true);
        }
        cb(`Error: formato de archivo no soportado, debe ser jpeg, jpg, png o gif, file: ${file.originalname}`,false);
    }
}).fields([ 
    {  name: 'banner'}, 
    {  name: 'posterFile'}, 
    {  name: 'prerollFile'},
    {  name: 'sponsorFile'},
    {  name: 'ad1File'},
    {  name: 'ad2File'},
    {  name: 'ad3File'},
    {  name: 'ad4File'},
    {  name: 'ad5File'},
    {  name: 'ad6File'}
])

const ifeqHelper = {
    if_eq: function (a, b, opts) {
        if (a == b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    }
};

const { isAuthenticated } = require('../helpers/auth');

const Cam = require("../models/Camara");//model

//show list cams 
router.get('/camaras', isAuthenticated, async (req, res) => {
    let camaras
    try {
        camaras = await Cam.find().sort({ name: "asc" });
        console.log(camaras);
    } catch (error) {
        console.log(error)
        req.flash('msg_error', `Error while try to get list of cams: l.57: ${error}`); 
        res.render('index', {
            helpers: ifeqHelper 
        })
        return;
    }
    res.render('camaras/list-cams', {
        camaras, 
        helpers: ifeqHelper 
    })
});

//show add new cam
router.get('/camaras/add', isAuthenticated, (req, res) => {
    res.render('camaras/add-cam', {
        helpers: ifeqHelper
    });
});

        //add cam
        router.post('/camaras/add', multerManager, isAuthenticated, async (req, res) => {
            const { 
                name, 
                slug, 
                title, 
                source, 
                ffmpeg, 
                lat, lng, 
                ciudad, pais, 
                gmapLink,
                posterName, prerollName, sponsorName, ad1Name, ad2Name, ad3Name, ad4Name, ad5Name, ad6Name,
                posterLink, prerollLink, sponsorLink, ad1Link, ad2Link, ad3Link, ad4Link, ad5Link, ad6Link
            } = req.body;
            let { enable, visible } = req.body;
            const errors = [];

            if(!name) errors.push({text: 'Please Insert name'});
            if(!slug) errors.push({text: 'Please Insert url'});
            if(!title) errors.push({text: 'Please Insert title'});
            if(!source) errors.push({text: 'Please Insert source'});

            if(errors.length > 0) {
                res.render('camaras/add-cam', {
                    errors,
                    name, slug, title, source, ffmpeg, enable, visible, lat, lng, ciudad, pais, gmapLink,
                    posterName, prerollName, sponsorName, ad1Name, ad2Name, ad3Name, ad4Name, ad5Name, ad6Name,
                    posterLink, prerollLink, sponsorLink, ad1Link, ad2Link, ad3Link, ad4Link, ad5Link, ad6Link,
                    helpers: ifeqHelper
                });
                return;
            } else {
                if(!enable){enable="off"};
                if(!visible){visible="off"};

                let banner;
                if(req.files.banner){ banner = req.files.banner[0].filename;}
                //console.log('req.files: ',req.files)
                let poster = {
                    name: posterName,
                    link: posterLink,
                    file: req.files.posterFile? req.files.posterFile[0].filename : ''
                }
                
                let preroll = {
                    name: prerollName,
                    link: prerollLink,
                    file: req.files.prerollFile? req.files.prerollFile[0].filename : ''
                }
                
                let sponsor = {
                    name: sponsorName,
                    link: sponsorLink,
                    file: req.files.sponsorFile? req.files.sponsorFile[0].filename : ''
                }
                
                let ad1 = {
                    name: ad1Name,
                    link: ad1Link,
                    file: req.files.ad1File? req.files.ad1File[0].filename : ''
                }
                
                let ad2 = {
                    name: ad2Name,
                    link: ad2Link,
                    file: req.files.ad2File? req.files.ad2File[0].filename : ''
                }
                
                let ad3 = {
                    name: ad3Name,
                    link: ad3Link,
                    file: req.files.ad3File? req.files.ad3File[0].filename : ''   
                }
                
                let ad4 = {
                    name: ad4Name,
                    link: ad4Link,
                    file: req.files.ad4File? req.files.ad4File[0].filename : ''
                }
                
                let ad5 = {
                    name: ad5Name,
                    link: ad5Link,
                    file: req.files.ad5File? req.files.ad5File[0].filename : ''
                }
                
                let ad6 = {
                    name: ad6Name,
                    link: ad6Link,
                    file: req.files.ad6File? req.files.ad6File[0].filename : ''
                }

                const newCam = new Cam({ 
                    name, slug, title, source, ffmpeg, enable, visible, lat, lng, ciudad, pais, gmapLink, 
                    banner, poster, preroll, sponsor, ad1, ad2, ad3, ad4, ad5, ad6 
                });

                try {
                    await newCam.save()
                } catch (error) {
                    req.flash('msg_error', 'Error saving to database'); 
                    res.render('camaras/add-cam', {
                        errors, name, slug, title, source, ffmpeg, enable, visible, lat, lng, ciudad, pais, gmapLink,
                        banner, poster, preroll, sponsor, ad1, ad2, ad3, ad4, ad5, ad6, helpers: ifeqHelper });
                    return;
                }
                // await newCam.save().catch(err => {
                //     req.flash('msg_error', 'Error saving to database'); 
                //     res.render('camaras/add-cam', {
                //         errors, name, slug, title, source, ffmpeg, enable, visible, lat, lng, ciudad, pais, gmapLink,
                //         banner, poster, preroll, sponsor, ad1, ad2, ad3, ad4, ad5, ad6, helpers: ifeqHelper });
                //     return;
                // });

                req.flash('msg_exito', 'Camara agregada!');
                res.redirect('/camaras');
            }
        });

//show edit cam by id
router.get('/camaras/edit/:id', isAuthenticated, async (req, res) => {
    let thiscam
    try {
        thiscam = await Cam.findById(req.params.id);
    } catch (error) {
        console.log(error)
        req.flash('msg_error', `Error while try to get cam l.201 ${error}`); 
        res.render('camaras/list-cams', { thiscam,
            helpers: ifeqHelper
        })
        return;
    }
    res.render('camaras/cam', { 
        thiscam,
        helpers: ifeqHelper
    })
});
/* router.put('/camaras/quitar/anuncio/:id', isAuthenticated, async (req, res) => {
    //req.params.id
    await Cam.findByIdAndUpdate(req.params.id, req.body).catch(err=>{
        req.flash('msg_error', 'No se pudo actualizar!');
        res.status(304).send('hubo un error al actualizar');
        return;
    });
    req.flash('msg_exito', 'Anuncio actualizado!');
    res.status(200).send('updated!');
}) */
//edit cam
router.put('/camaras/edit/:id', multerManager, isAuthenticated, async (req, res) =>{
    const { 
        name, 
        slug, 
        title, 
        source, 
        ffmpeg, 
        lat, lng, 
        ciudad, pais, 
        gmapLink,
        posterName, prerollName, sponsorName, ad1Name, ad2Name, ad3Name, ad4Name, ad5Name, ad6Name,
        posterLink, prerollLink, sponsorLink, ad1Link, ad2Link, ad3Link, ad4Link, ad5Link, ad6Link
     } = req.body;

    let { enable, visible } = req.body;
    const errors = [];
    //console.log("enable: ",enable);
    
    if(!name) errors.push({text: 'Please Insert name'});
    if(!slug) errors.push({text: 'Please Insert url'});
    if(!title) errors.push({text: 'Please Insert title'});
    if(!source) errors.push({text: 'Please Insert source'});
    //if((!lat && !lng) || !gmapLink) errors.push({text: 'Please Insert lattitude and longitude, or map link '});

    
    if(errors.length > 0){
        res.render('camaras/add-cam',{
            errors,
            name, slug, title, source, ffmpeg, enable, visible, lat, lng, ciudad, pais, gmapLink,
            posterName, prerollName, sponsorName, ad1Name, ad2Name, ad3Name, ad4Name, ad5Name, ad6Name,
            posterLink, prerollLink, sponsorLink, ad1Link, ad2Link, ad3Link, ad4Link, ad5Link, ad6Link,
            helpers: ifeqHelper
        });
        return;
    }else{
        let objectToUpdate = {}

        //no spaces in the name
        let nameN = name.replace(/\s/g, "");
            objectToUpdate.name = nameN;
        let slugN = slug.replace(/\s/g, "-");
            objectToUpdate.slug = slugN;

            objectToUpdate.title = title;
            objectToUpdate.source = source;
            objectToUpdate.ffmpeg = ffmpeg? ffmpeg : '';

        if (!enable) { enable = "off" };
            objectToUpdate.enable = enable;
        if (!visible) { visible = "off" };
            objectToUpdate.visible = visible;

            objectToUpdate.lat = lat? lat : '';
            objectToUpdate.lng = lng? lng : '';
            objectToUpdate.ciudad = ciudad? ciudad : '';
            objectToUpdate.pais = pais? pais : '';
            objectToUpdate.gmapLink = gmapLink? gmapLink : '';
            
            if(req.files.banner){ 
                objectToUpdate.banner = req.files.banner[0].filename;}
                
            objectToUpdate.poster = {
                name: posterName? posterName : '',
                link: posterLink? posterLink : '',
                file: req.files.posterFile && req.files.posterFile[0].filename
            }
            objectToUpdate.preroll = {
                name: prerollName? prerollName : '',
                link: prerollLink? prerollLink : '',
            }
            objectToUpdate.sponsor = {
                name: sponsorName? sponsorName : '',
                link: sponsorLink? sponsorLink : ''
            }
        if(req.files.prerollFile){ 
            objectToUpdate.preroll = {
                file: req.files.prerollFile[0].filename
            }
        }
        if(req.files.sponsorFile){ 
            objectToUpdate.sponsor = {
                file: req.files.sponsorFile[0].filename
            }
        }
        if(req.files.ad1File){ 
            objectToUpdate.ad1 = {
                file: req.files.ad1File[0].filename
            }
        }
        if(req.files.ad2File){ 
            objectToUpdate.ad2 = {
                file: req.files.ad2File[0].filename
            }
        }
        if(req.files.ad3File){ 
            objectToUpdate.ad3 = {
                file: req.files.ad3File[0].filename
            }
        }
        if(req.files.ad4File){ 
            objectToUpdate.ad4 = {
                file: req.files.ad4File[0].filename
            }
        }
        if(req.files.ad5File){ 
            objectToUpdate.ad5 = {
                file: req.files.ad5File[0].filename
            }
        }
        if(req.files.ad6File){ 
            objectToUpdate.ad6 = {
                file: req.files.ad6File[0].filename
            }
        }

        try {
            await Cam.findByIdAndUpdate(req.params.id, objectToUpdate)
        } catch (error) {
            console.log('error l.285: ',error);
            req.flash('msg_error', `o se pudo actualizar .l.354: ${error}`);
            res.render('camaras/cam',{
                errors,
                name, slug, title, source, ffmpeg, enable, visible, lat, lng, ciudad, pais, gmapLink,
                posterName, prerollName, sponsorName, ad1Name, ad2Name, ad3Name, ad4Name, ad5Name, ad6Name,
                posterLink, prerollLink, sponsorLink, ad1Link, ad2Link, ad3Link, ad4Link, ad5Link, ad6Link,
                helpers: ifeqHelper
            });
            return;
        }
        // await Cam.findByIdAndUpdate(req.params.id, objectToUpdate).catch(err=>{
        //     console.log('error l.285: ',err);
        //     req.flash('msg_error', 'No se pudo actualizar!');
        //     res.render('camaras/cam',{
        //         errors,
        //         name, slug, title, source, ffmpeg, enable, visible, lat, lng, ciudad, pais, gmapLink,
        //         posterName, prerollName, sponsorName, ad1Name, ad2Name, ad3Name, ad4Name, ad5Name, ad6Name,
        //         posterLink, prerollLink, sponsorLink, ad1Link, ad2Link, ad3Link, ad4Link, ad5Link, ad6Link,
        //         helpers: ifeqHelper
        //     });
        //     return;
        // });
        req.flash('msg_exito', 'Camara modificada!');
        res.redirect('/camaras');
    }
});

//delete cam
router.delete('/camaras/delete/:id', isAuthenticated, async (req, res) =>{
    try {
        await Cam.findByIdAndDelete(req.params.id);
    } catch (error) {
        console.log(error)
        req.flash('msg_error', `Error al intentar borrar la camara! l.387: ${error}`);
        res.redirect('/camaras');
        return;
    }
    req.flash('msg_info', 'Camara borrada!');
    res.redirect('/camaras');
})

module.exports = router;