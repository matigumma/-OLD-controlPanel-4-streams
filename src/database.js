const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://mongo_freewaves:UsjQDN3WT7dpxSCZ@cluster0fw-alobx.mongodb.net/test?retryWrites=true&w=majority',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db => console.log('mogno conectado'))
    .catch(err => console.log('hubo un error al conectar'));