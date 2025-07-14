const { text } = require('body-parser');
const { Schema, model } = require('mongoose');
const Paginator = require('mongoose-paginate-v2');

const PostSchema = new Schema({
    postImage:{
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                ref: "users",
                type: Schema.Types.ObjectId,
            },
        }
    ],
},
{ timestamps: true });

PostSchema.plugin(Paginator);

