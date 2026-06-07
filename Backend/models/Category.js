import mongoose from 'mongoose';

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true }
};

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  products: { type: Number, default: 0 },
  image: { type: String }
}, schemaOptions);

categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
