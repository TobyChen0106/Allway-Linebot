// const mongoose = require('mongoose')
// const Schema = mongoose.Schema


// const setMongoMixedWithBadKeys = data =>
//     Array.isArray(data)
//         ? data.map(setMongoMixedWithBadKeys)
//         : typeof data === 'object'
//             ? Object.entries(data).reduce((a, [key, value]) => ({ ...a, [key.replace('.', '__').replace('$', '___')]: setMongoMixedWithBadKeys(value) }), {})
//             : data

// const getMongoMixedWithBadKeys = data =>
//     Array.isArray(data)
//         ? data.map(getMongoMixedWithBadKeys)
//         : typeof data === 'object'
//             ? Object.entries(data).reduce((a, [key, value]) => ({ ...a, [key.replace('__', '.').replace('___', '$')]: getMongoMixedWithBadKeys(value) }), {})
//             : data

// const Note = new Schema({
//     updateTime: {
//         type: String,
//         required: true
//     },
//     updateSource: {
//         type: String,
//         required: true
//     },
// })

// const CardSchema = new Schema({
//     cardID: {
//         type: String,
//         required: true
//     },
//     cardName: {
//         type: String,
//         required: true
//     },
//     cardBank: {
//         type: String,
//         required: true
//     },
//     imageUrl: {
//         type: String,
//         // required: true
//     },
//     imageRotate: {
//         type: Boolean,
//         // required: true
//     },
//     imageLocal: {
//         type: String,
//         // required: true
//     },
//     offer: {
//         type: Schema.Types.Mixed,
//         get: getMongoMixedWithBadKeys,
//         set: setMongoMixedWithBadKeys,
//         // required: true
//     },
//     note: {
//         type: Note,
//         // required: true
//     }
// });

// const UserSchema = new Schema({
//     lineID: {
//         type: String,
//         required: true
//     },
//     displayName: {
//         type: String,
//         required: true
//     },
//     nickName: {
//         type: String,
//         required: true
//     },
//     age:{
//         type: Number,
//         required: true
//     },
//     gender: {
//         type: String,
//         required: true
//     },
//     cards:{
//         type: [CardSchema],
//         default: undefined,
//     },
//     stores:{
//         type: [String],
//         default: undefined,
//     }
// });

// const User = mongoose.model('User', UserSchema, "users");
// module.exports = User;
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const setMongoMixedWithBadKeys = data =>
    Array.isArray(data)
        ? data.map(setMongoMixedWithBadKeys)
        : typeof data === 'object'
            ? Object.entries(data).reduce((a, [key, value]) => ({ ...a, [key.replace('.', '__').replace('$', '___')]: setMongoMixedWithBadKeys(value) }), {})
            : data

const getMongoMixedWithBadKeys = data =>
    Array.isArray(data)
        ? data.map(getMongoMixedWithBadKeys)
        : typeof data === 'object'
            ? Object.entries(data).reduce((a, [key, value]) => ({ ...a, [key.replace('__', '.').replace('___', '$')]: getMongoMixedWithBadKeys(value) }), {})
            : data

const UserSchema = new Schema({
    lineID: {
        type: String,
        // required: true
    },
    displayName: {
        type: String,
        // required: true
    },
    nickName: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    cards:{
        // cardID
        type: [String],
        default: undefined,
    },
    favoriteStores:{
        type: [String],
        default: undefined,
    }
});

const User = mongoose.model('User', UserSchema, "users");
module.exports = User;