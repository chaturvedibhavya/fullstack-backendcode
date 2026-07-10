const mongoose = require("mongoose");

const woodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Wood name is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["hardwood", "softwood"],
            required: [true, "Type must be 'hardwood' or 'softwood'"],
        },
        origin: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
        },
        density: {
            // kg/m3
            type: Number,
            min: 0,
        },
        pricePerUnit: {
            type: Number,
            min: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
        image: {
            type: String,
            required: [true, 'Image is required']
        }
    },
    { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Wood", woodSchema);
