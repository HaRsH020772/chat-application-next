const mongoose = require('mongoose');

const connectToDB = () => {
    
    mongoose.set('strictQuery', false);

    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB got connected!!"))
    .catch(err => {
        console.log("DB connection issues!!");
        console.log(err);
        process.exit(1);
    });
}

module.exports = connectToDB;
