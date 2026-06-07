import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, default: "Admin" },
  email: { type: String, required: true },
  phone: { type: String },
  password: { type: String, required: true, select: false }
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.password;
      return ret;
    }
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;
