const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.APP_DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connected to DB!')
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB;




