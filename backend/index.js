const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/Product')
const app = express()
const cors = require('cors')
const Order = require('./models/Order')

app.use(express.json())
mongoose.connect("mongodb+srv://roquebernedo:extreme123@cluster0.ezxtpm7.mongodb.net/?retryWrites=true&w=majority")

app.use(cors())

app.get("/", async (req, res) => {
    try{
        const response = await Product.find({})
        res.json(response)
    } catch (err){
        res.json(err)
    }
})

app.get("/orders", async (req, res) => {
  try{
      const response = await Order.find({})
      res.json(response)
  } catch (err){
      res.json(err)
  }
})

app.post("/", async (req, res) => {
  const body = req.body
  
  const product = new Product({
    name: body.name,
    unitPrice: body.unitPrice,
    qty: body.qty
  })
  
  const savedProduct = await product.save()
  res.json(savedProduct)
});

//let orderCounter = 1

app.post('/order', async (req, res) => {
    const body = req.body
    //const user = req.user

    // Recuperar productos por sus IDs
    //const products = await Product.findById("657b586791afef4357834120")
    //console.log(products)

    // Verificar si todos los IDs corresponden a productos válidos
  
    const order = new Order({
      name: body.name,
      Order: body.Order,
      Date: new Date(),
      Products: [],
    })
  
    const savedOrder = await order.save()
    //user.blogs = user.blogs.concat(savedBlog._id)
    //await user.save()
    
    res.json(savedOrder)  
})

app.put('/orden/:id', async (request, response, next) => {
  const body = request.body
  console.log(body.Products)
  
  const existingOrder = await Order.findById(request.params.id);

  const productToAdd = await Product.findById(body.Products);

  existingOrder.Products.push(productToAdd);

  const updatedOrder = await Order.findByIdAndUpdate(request.params.id, existingOrder, {new: true})
  response.json(updatedOrder)
})

app.get("/order/:id", async (req, res) => {
    try{
      const order = await Order.findById(req.params.id);
      
      if (!order) {
          return res.status(404).json({ error: 'Product not found' });
      }
      res.json(order); 
    } catch (err){
      res.status(500).json({ error: 'Server error' });
    }
})

app.get("/order/:id/AddProduct", async (req, res) => {
  try{
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(order); 
  } catch (err){
    res.status(500).json({ error: 'Server error' });
  }
})

app.delete('/orderr/:id', async (request, response, next) => {
  try {
    const result = await Order.findByIdAndDelete(request.params.id);
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/delete-order/:id/product/:productId', async (request, response, next) => {
  try {
    const orderId = request.params.id;
    const productId = request.params.productId;

    const order = await Order.findById(orderId);
    console.log(order)

    if (!order) {
      return response.status(404).json({ error: 'Order not found' });
    }

    // Filtrar los productos, manteniendo solo aquellos que no coinciden con el productId
    order.Products = order.Products.filter(product => String(product._id) !== productId);

    // Guardar la orden actualizada
    await order.save();

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

  
const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})