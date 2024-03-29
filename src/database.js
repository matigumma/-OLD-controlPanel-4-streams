const mongoose = require("mongoose");

async function connectDb({db_username, db_pass, db_uri, db_port, db_name}){
  const URI = `mongodb://${db_username}:${db_pass}@${db_uri}:${db_port}/${db_name}`
  await mongoose.connect(URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
}

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
});
 
module.exports = connectDb
