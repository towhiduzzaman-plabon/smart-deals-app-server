const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

//W126WHjjE2AehHOp
//smartdb_user
// MongoDB Connection URI

const uri = "mongodb+srv://smartdb_user:W126WHjjE2AehHOp@cluster0.hd5uevl.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Smart Deals Server is running');
});

// Database Operations
async function run() {
    try {
        await client.connect();
        const db = client.db("smart_db");
        const productsCollection = db.collection("products");
        const usersCollection = db.collection("bids");


        // Get all products
        app.get('/products', async (req, res) => {
            // const projectFields = { title: 1, price_min: 1, price_max: 1, image: 1};
            // const cursor = productsCollection.find().sort({ price_min: -1 }).skip(2).limit(2).project(projectFields);

            console.log(req.query);
            const email = req.query.email;
            const query = {}
            if(email){
                query.email = email;
            }

            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get a single product by ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        // Add a new product
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        });

        // Update a product
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price
                }
            };
            const result = await productsCollection.updateOne(query, update);
            res.send(result);
        });


    // Delete a product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });


        //bids related api
        app.get('/bids', async (req, res) => {

            const email = req.query.email;
            const query = {};
            if(email){
                query.buyer_email = email;
            }

            const cursor = usersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

       // Add a new bid
        app.post('/bids', async (req, res) => {
            const newBid = req.body;
            const result = await bidsCollection.insertOne(newBid);
            res.send(result);
        });

        // Update a bid
        app.patch('/bids/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBid = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    bid_price: updatedBid.bid_price
                }
            };
            const result = await usersCollection.updateOne(query, update);
            res.send(result);
        });
        
        // Delete a bid
        app.delete('/bids/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bidsCollection.deleteOne(query);
            res.send(result);
        });




    // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    finally {

    }
}
// Call the run function to connect to the database
run ().catch(console.dir);




// Start the server
app.listen(port, () => {
    console.log(`Smart Server is running on port: ${port}`);
});