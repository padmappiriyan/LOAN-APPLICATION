import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    // Personal Details
    fullName: { type: String, required: true, trim: true },
    nic: { type: String, required: true, unique: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },

    // Contact Details
    mobileNumber: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, trim: true },
    emailAddress: { type: String, trim: true, lowercase: true },
    currentAddress: { type: String, required: true, trim: true },

    // System Linkage
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Blacklisted'], default: 'Active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
