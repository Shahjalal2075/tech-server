const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('UserName: ', process.env.DB_USER);
console.log('Password: ', process.env.DB_PASS);


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6b6iw5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const database = client.db("techDB");
    const usersCollectionBrands = database.collection("brands");
    const usersCollectionProducts = database.collection("products");
    const usersCollectionCart = database.collection("cart");

    app.get('/brands', async (req, res) => {
      const cursor = usersCollectionBrands.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/cart', async (req, res) => {
      const cursor = usersCollectionCart.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const product = usersCollectionCart.find(query);
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const cursor = usersCollectionProducts.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = { brandName: brand }
      const product = usersCollectionProducts.find(query);
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/products/:brand/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const product = await usersCollectionProducts.findOne(query);
      res.send(product);
    })

    app.put('/products/:brand/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          productName: product.productName,
          brandName: product.brandName,
          type: product.type,
          price: product.price,
          photo: product.photo,
          rating: product.rating
        }
      }
      const result = await usersCollectionProducts.updateOne(filter, updatedProduct, options);
      res.send(result);
    })

    app.post('/products', async (req, res) => {
      const product = req.body;
      console.log('new product', product);
      const result = await usersCollectionProducts.insertOne(product);
      res.send(result);
    })

    app.post('/cart', async (req, res) => {
      const product = req.body;
      console.log('new cart product', product);
      const result = await usersCollectionCart.insertOne(product);
      res.send(result);
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete server id: ', id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollectionCart.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Curd Running serverr");
})

app.listen(port, () => {
  console.log(`Ser running port: ${port}`);
}) 