import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' } // OTP will expire in 5 minutes
    }
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
