const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
const cors =require('cors');

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gktwx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try {
        await client.connect();
        // console.log('connected to database')
        const database =client.db('assingmentData');
        const servicesCollection =database.collection('products');

     
        //GET
          app.get('/product', async (req,res)=>{
           const cursor =servicesCollection.find({});
           const product =await cursor.toArray();
           res.send(product);
    })

    //GET SINGGLE PRODUCT
    app.get('/product/:id',async(req ,res) =>{
        const id = req.params.id;
        // console.log('getting specific service',id)
        const query ={_id:ObjectId(id)};
        const product =await servicesCollection.findOne(query);
        res.json(product);

    })



        //POST ApI
        app.post('/product',async(req,res) =>{
            const product =req.body;
            console.log('hit the post api',product);
           
            const result =await servicesCollection.insertOne(product);
            console.log(result);
            res.json(result)
        })

        //DELETE API
        app.delete('/product/:id',async(req,res)=>{
            const id =req.params.id;
            const query={_id:ObjectId(id)};
            const result =await servicesCollection.deleteOne(query);
            res.json(result);

        })



       
      } finally {
        // await client.close();
      }
}

run().catch(console.dir);

app.get('/',(req, res) =>{
    res.send('Running assingment-11 Server');
})

app.listen(port, ()=>{
    console.log('Running assingment-11 Server on port', port)
})