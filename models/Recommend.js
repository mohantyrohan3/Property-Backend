const mongoose = require('mongoose')


const RecommendSchema = new mongoose.Schema({
    from_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
}, { timestamps: true });


module.exports = mongoose.model('Recommend', RecommendSchema);