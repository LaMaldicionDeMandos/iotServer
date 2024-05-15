const mongoose = require('mongoose');

const Schema = mongoose.Schema;

console.log('Connect to ' + process.env.MONGODB_URI);
const UserSchema = new Schema({
    _id: String,
    username: {type: String, index: true},
    password: String,
    state: { type: String, enum: ['ACTIVE', 'INACTIVE']},
    validationCode: String,
    profile: {},
}, {timestamps: true});

const DeviceSchema = new Schema({
    _id: String,
    ownerId: {type: String, index: true},
    type: {type: String, enum: ['switch']},
    name: String,
    houseId: {type: String, index: true},
    roomId: String
}, {timestamps: true});

const HouseSchema = new Schema({
    _id: String,
    ownerId: {type: String, index: true},
    name: String,
    isPrimary: Boolean
}, {timestamps: true});

const RoomSchema = new Schema({
    _id: String,
    ownerId: {type: String, index: true},
    houseId: String,
    name: String,
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);
const Device = mongoose.model('Device', DeviceSchema);
const House = mongoose.model('House', HouseSchema);
const Room = mongoose.model('Room', RoomSchema);

const db = new function() {
    mongoose.connect(process.env.MONGODB_URI);
    this.mongoose = mongoose;
    this.Schema = Schema;
    this.ObjectId = mongoose.Types.ObjectId;
    this.User = User;
    this.Device = Device;
    this.House = House;
    this.Room = Room;
};

process.on('exit', function() {
    console.log('Desconnecting db');
    mongoose.disconnect();
});

module.exports = db;
