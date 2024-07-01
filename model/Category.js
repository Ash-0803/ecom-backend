import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
  label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
});

categorySchema.virtual("id").get(function () {
  return this._id;
});
categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Category = mongoose.model("Category", categorySchema);
