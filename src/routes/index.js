const router = require("express").Router();

router.get('/', (req, res) => {
    res.render('index', {
        helpers: {// if_eq del checkbox
            if_eq: function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            }
        }
    });
});

router.get('/anuncios', (req, res) => {
    res.render('anuncios', {
        helpers: {// if_eq del checkbox
            if_eq: function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            }
        }
    });
});

router.get('/settings', (req, res) => {
    res.render('settings', {
        helpers: {// if_eq del checkbox
            if_eq: function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            }
        }
    });
});

module.exports = router;