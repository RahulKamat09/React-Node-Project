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

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true, select: false },
  registered: { type: String },
  orders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  status: { type: String, default: "Active" }
}, schemaOptions);

customerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;
