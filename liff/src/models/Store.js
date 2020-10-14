const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreSchema = new Schema({
    storeName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        required: true
    },
    note: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const Store = mongoose.model('Store', StoreSchema);
module.exports = Store;