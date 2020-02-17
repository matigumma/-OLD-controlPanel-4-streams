const router = require("express").Router();

const ifeqHelper = {
    if_eq: function (a, b, opts) {
        if (a == b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    }
}

router.get('/', (req, res) => {
    res.render('index', 
    {helpers: ifeqHelper});
});

router.get('/settings', (req, res) => {
    res.render('settings', 
    {helpers: ifeqHelper});
});

module.exports = router;