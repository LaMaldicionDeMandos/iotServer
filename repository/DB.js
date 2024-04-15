const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const UserSchema = new Schema({
    _id: String,
    username: {type: String, index: true},
    password: String,
    profile: {},
    provider: String,
    roles:[String]
}, {timestamps: true});

const PracticeSchema = new Schema({
    _id: String,
    code:String,
    'module':String,
    name:String,
    friendlyName: String,
    specialty:String,
    category:String,
    cartType: String,
    credits: Number
});

const ProviderAddressSchema = new Schema({
    _id: String,
    provider: {type: String, index: true},
    address:String,
    flat:String,
    components: [{long_name: String, short_name: String, types: [String]}],
    location: {type: pointSchema, index: {type: '2dsphere', sparse: true}}
});

const CreditPackageSchema = new Schema( {
   _id: String,
    code: String,
    title: String,
    credits: Number,
    description: String
});

const PaymentInfoSchema = new Schema( {
    _id: String,
    transaction_id: {type: String, index: true},
    card: {},
    currency_id: String,
    date_approved: String,
    description: String,
    fee_details: [{}],
    installments: Number,
    operation_type: String,
    payer: {},
    payment_method_id: String,
    payment_type_id: String,
    platform_id: String,
    point_of_interaction: {},
    processing_mode: String,
    taxes_amount: Number,
    transaction_amount_refunded: Number,
    transaction_details: {}
}, {timestamps: true});

const CreditsPurchaseSchema = new Schema( {
    _id: String,
    transaction_id: String,
    credits: Number,
    price: Number,
    from: String,
    fund: Number,
    owner: String,
    operation_id: String,
}, {timestamps: true});

const CreditsSchema = new Schema({
    _id:String,
    owner: {type: String, index: true},
    available:Number,
    reserved:Number,
    expirationDate: Date
}, {timestamps: true});

const PracticePaidOutSchema = new Schema( {
    _id: String,
    providerUsername: {type: String, index: true},
    customerUsername:{type: String, index: true},
    orderId: {type: String, index: true},
    practiceIds: [String],
    practiceNames: [String],
    state: { type: String, enum: ['pending', 'approved', 'paid', 'canceled', 'invoiced']},
    credits: Number,
    operationIds: [String],
    price: Number,
    netId: String,
    netFee: Number,
    transactionId: String,
    invoice: {type: String, index: true}
}, {timestamps: true});

const MessageSchema = new Schema( {
    _id: String,
    roles: {type: String, index: true, enum: ['any', 'customer_only', 'provider_only']},
    subject: String,
    title: String,
    message: String,
    destination: {type: String, index: true, enum: ['any', 'email', 'app']}
}, {timestamps: true});

const CASH_IN = "cash-in";
const CASH_OUT = "cash-out";
const CASH_OUT_FROM_RESERVED = "cash-out-from-reserved";
const CASH_RESERVE = "reserve";
const CASH_CANCEL_RESERVE = "cancel-reserve";
const EXPIRE = "expire";
const WalletOperationSchema = new Schema({
    _id:String,
    customer:String,
    amount:Number,
    operation: {
        type: String,
        enum: [CASH_IN, CASH_OUT, CASH_RESERVE, CASH_CANCEL_RESERVE, EXPIRE, CASH_OUT_FROM_RESERVED]
    }
    },{timestamps: true});

const CREDITS_PURCHASE = "credits-purchase";
const RESERVE_TO_PAY = "reserve-to-pay";
const CANCEL_RESERVATION = "cancel-reservation";
const PAY_TO_CUSTOMER = "pay-to-customer";
const MONEY_CASH_OUT = CASH_OUT;
const MoneyOperationSchema = new Schema({
    _id:String,
    amount:Number,
    operation: {
        type: String,
        enum: [CREDITS_PURCHASE, RESERVE_TO_PAY, PAY_TO_CUSTOMER, MONEY_CASH_OUT,CANCEL_RESERVATION]
    }
},{timestamps: true});

const MoneyConciliationSchema = new Schema({
    _id:String,
    available:Number,
    reserved: Number
},{timestamps: true});

const FrequentQuestionSchema = new Schema({
    _id:String,
    question: String,
    answer:String,
    link:String,
});

const NumericVarsSchema = new Schema({
    _id:String,
    name: String,
    value:Number
});

const ProviderNetSchema = new Schema({
    _id:String,
    name: String,
    fee: Number,
    providerIds:[String]
});

const FreeCreditsCouponSchema = new Schema({
    _id:String,
    name: String,
    code: String,
    credits: Number,
    totalAmount: Number,
    currentAmount: Number,
    users: [String]
});

MoneyOperationSchema.plugin(mongoosePaginate);
WalletOperationSchema.plugin(mongoosePaginate);
PaymentInfoSchema.plugin(mongoosePaginate);
CreditsPurchaseSchema.plugin(mongoosePaginate);
PracticePaidOutSchema.plugin(mongoosePaginate);


const User = mongoose.model('User', UserSchema);
const Practice = mongoose.model('Practice', PracticeSchema);
const ProviderAddress = mongoose.model('ProviderAddress', ProviderAddressSchema);
const CreditPackage = mongoose.model('CreditPackage', CreditPackageSchema);
const CreditsPurchase = mongoose.model('CreditsPurchase', CreditsPurchaseSchema);
const PaymentInfo = mongoose.model('PaymentInfo', PaymentInfoSchema);
const Credits = mongoose.model('Credits', CreditsSchema);
const WalletOperation = mongoose.model('WalletOperation', WalletOperationSchema);
const MoneyOperation = mongoose.model('MoneyOperation', MoneyOperationSchema);
const MoneyConciliation = mongoose.model('MoneyConciliation', MoneyConciliationSchema);
const PracticePaidOut = mongoose.model('PracticePaidOut', PracticePaidOutSchema);
const Message = mongoose.model('Message', MessageSchema);
const FrequentQuestion = mongoose.model('FrequentQuestion', FrequentQuestionSchema);
const NumericVars = mongoose.model('NumericVars', NumericVarsSchema);
const ProviderNet = mongoose.model('ProviderNet', ProviderNetSchema);
const FreeCreditsCoupon = mongoose.model('FreeCreditsCoupon', FreeCreditsCouponSchema);

const db = new function() {
    mongoose.connect(process.env.MONGODB_URI);
    this.mongoose = mongoose;
    this.Schema = Schema;
    this.ObjectId = mongoose.Types.ObjectId;
    this.User = User;
    this.Practice = Practice;
    this.ProviderAddress = ProviderAddress;
    this.CreditPackage = CreditPackage;
    this.CreditsPurchase = CreditsPurchase;
    this.PaymentInfo = PaymentInfo;
    this.Credits = Credits;
    this.WalletOperation = WalletOperation;
    this.MoneyOperation = MoneyOperation;
    this.MoneyConciliation = MoneyConciliation;
    this.PracticePaidOut = PracticePaidOut;
    this.Message = Message;
    this.FrequentQuestion = FrequentQuestion;
    this.NumericVars = NumericVars;
    this.ProviderNet = ProviderNet;
    this.FreeCreditsCoupon = FreeCreditsCoupon;
};

process.on('exit', function() {
    console.log('Desconnecting db');
    mongoose.disconnect();
});

module.exports = db;
