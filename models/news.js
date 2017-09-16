
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create mrticle schema
var NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    }
});

// create the movie model with the MovieSchema
var News = mongoose.model("News", NewsSchema);

// export the model
module.exports = News;
