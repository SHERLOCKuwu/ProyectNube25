const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    }
});

// hashear la contraseña antes de guardar el usuario
userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// comparar la contraseña
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// verificar si el usuario es administrador
userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

// verificar si el usuario es regular
userSchema.methods.isUser = function() {
    return this.role === 'user';
};

const User = mongoose.model('User', userSchema);

module.exports = User;
