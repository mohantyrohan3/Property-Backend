const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // tls: false,
    family: 4 // Uses Ipv4
    
});

const db = mongoose.connection;
db.on('error', console.error.bind(console,'Error Connecting to Db'));

db.once('open',function(){
    console.log('Successfully Connected To database');
});


module.exports = mongoose;