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

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true }
  },
  payment: {
    method: { type: String, required: true },
    status: { type: String, required: true }
  },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  date: { type: String }
}, schemaOptions);

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
