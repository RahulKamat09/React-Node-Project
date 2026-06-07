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

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  category: { type: String, required: true },
  gender: { type: String },
  description: { type: String },
  fullDescription: { type: String },
  image: { type: String },
  hoverImage: { type: String },
  badge: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  status: { type: String, default: "In Stock" },
  inStock: { type: Boolean, default: true }
}, schemaOptions);

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Prevent mongoose model compilation error if model already compiled
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
