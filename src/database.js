const mongoose = require("mongoose");
require('dotenv').config();

const dbURI = 'mongodb://'
              +process.env.MONGO_INITDB_ROOT_USERNAME+':'
              +process.env.MONGO_INITDB_ROOT_PASSWORD+'@'
              +process.env.DB_MONGO_URI+'/'
              +process.env.DB_NAME;

console.log(dbURI);

setTimeout(function(){ 
  mongoose.connect(dbURI, {
    autoReconnect: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).catch(err => console.log('hubo un error al conectar: ', err));
}, 15000);

var db = mongoose.connection;

db.on('connecting', function() {
  console.log('connecting to MongoDB...');
});
db.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});
db.on('connected', function() {
  console.log('MongoDB connected!');
});
db.once('open', function() {
  console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  setTimeout(function(){ 
    mongoose.connect(dbURI, {
      autoReconnect: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }).catch(err => console.log('hubo un error al conectar: ', err));
  }, 15000);
});
