const mongoose = require('mongoose');

exports.validateId = (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
            success: false,
            message: 'ID de producto no válido'
        });
    }
    
    next();
};