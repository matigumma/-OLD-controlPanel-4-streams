const config = {
    appConfig:{
        port: process.env.APP_PORT || 3000,
        secret: process.env.APP_SECRET
    },
    dbConfig:{
        db_port: process.env.DB_PORT,
        db_uri: process.env.DB_MONGO_URI,
        db_name: process.env.DB_NAME,
        db_username: process.env.MONGO_INITDB_ROOT_USERNAME,
        db_pass: process.env.MONGO_INITDB_ROOT_PASSWORD
    }
}
module.exports = config