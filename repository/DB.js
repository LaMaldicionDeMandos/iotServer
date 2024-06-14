const mongoose = require('mongoose');

const expireAfterSeconds = 60*30;

const Schema = mongoose.Schema;

console.log('Connect to ' + process.env.MONGODB_URI);
const PasswordRecoverySchema = new Schema({
    _id: String,
    username: {type: String, index: true},
    code: String,
}, {timestamps: true});

PasswordRecoverySchema.index({ createdAt: 1 }, { expireAfterSeconds: expireAfterSeconds });

const UserSchema = new Schema({
    _id: String,
    username: {type: String, index: true},
    password: String,
    state: { type: String, enum: ['ACTIVE', 'INACTIVE']},
    validationCode: String,
    profile: {},
    passwordRecoveryCode: String
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

const ScheduleSchema = new Schema({
    month: Number,
    dayOfMonth: Number,
    dayOfWeek: { type: String, enum: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']},
    hour: Number,
    minute: Number,
    timeZone: String
});

const SceneConditionSchema = new Schema({
   type: {type: String, enum: ['touch', 'device_state', 'schedule']},
   deviceId: String,
   state: String,
   schedules: [ScheduleSchema]
});

const SceneActionSchema = new Schema({
    type: {type: String, enum: ['device', 'wait']},
    deviceId: String,
    state: String,
    time: String
});

const SceneSchema = new Schema({
    _id: String,
    ownerId: {type: String, index: true},
    houseId: String,
    name: String,
    condition: SceneConditionSchema,
    actions: [SceneActionSchema]
}, {timestamps: true});

const PasswordRecovery = mongoose.model('PasswordRecovery', PasswordRecoverySchema);
const User = mongoose.model('User', UserSchema);
const Device = mongoose.model('Device', DeviceSchema);
const House = mongoose.model('House', HouseSchema);
const Room = mongoose.model('Room', RoomSchema);
const Scene = mongoose.model('Scene', SceneSchema);

const db = new function() {
    mongoose.connect(process.env.MONGODB_URI);
    this.mongoose = mongoose;
    this.Schema = Schema;
    this.ObjectId = mongoose.Types.ObjectId;
    this.PasswordRecovery = PasswordRecovery;
    this.User = User;
    this.Device = Device;
    this.House = House;
    this.Room = Room;
    this.Scene = Scene;
};

process.on('exit', function() {
    console.log('Desconnecting db');
    mongoose.disconnect();
});

module.exports = db;
