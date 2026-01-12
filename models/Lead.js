const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String
        },
        type: {
            type: String,

        },
        message: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
