const mongoose = require('mongoose');

const Schema = mongoose.Schema;

console.log('Connect to ' + process.env.MONGODB_URI);
const UserSchema = new Schema({
    _id: String,
    username: {type: String, index: true},
    password: String,
    state: String,
    profile: {}
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

const db = new function() {
    mongoose.connect(process.env.MONGODB_URI);
    this.mongoose = mongoose;
    this.Schema = Schema;
    this.ObjectId = mongoose.Types.ObjectId;
    this.User = User;
};

process.on('exit', function() {
    console.log('Desconnecting db');
    mongoose.disconnect();
});

module.exports = db;
