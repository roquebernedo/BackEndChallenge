const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name: String,
  Order: { type: Number },
  Date: { type: Date },
  Products: [{ 
    
    name: String,
    unitPrice: Number,
    qty: Number,
    
  }],
  //FinalPrice: { type: Number }
});

OrderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;