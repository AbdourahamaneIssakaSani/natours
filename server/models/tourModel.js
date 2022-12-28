const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    id: { type: Number },
    productName: { type: String },
    image: { type: String },
    from: { type: String },
    nutrients: { type: String },
    quantity: { type: String },
    price: { type: String },
    organic: { type: Boolean },
    description: { type: String },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tours", tourSchema);

module.exports = Tour;
