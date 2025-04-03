import { mongoose, Schema } from "mongoose";
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [1, "wrong min price"],
    max: [10000, "wrong max price"],
  },
  discountPercentage: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
    default: 1,
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max price"],
    default: 0,
  },
  stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  colors: { type: [Schema.Types.Mixed] },
  sizes: { type: [Schema.Types.Mixed] },
  highlights: { type: [String] },
  discountPrice: { type: Number },
  deleted: { type: Boolean, default: false },
});

// we are using virutal here because :
// VIRTUAL: creates a sort of virtual collection at the time of fetching data from the database by frontend.
// And _id is created by MongoDB by default. but, frontend uses "id" instead of "_id".
// So, we are creating a virtual field "id" which will be used by the frontend.

ProductSchema.virtual("id").get(function () {
  return this._id;
});

ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Product = mongoose.model("Product", ProductSchema);
