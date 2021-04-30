const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnprp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("assignment10").collection("collection");
  const order = client.db("assignment10").collection("orders");
   

  app.post('/addOrder', (req, res)=>{
    const orderBody = req.body
    order.insertOne(orderBody)
    .then(response => {
      console.log(response) 
      res.send(response)
    })
  });

  app.get('/showOrders', (req, res) => {
    order.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
  });

  app.get('/products', (req, res)=>{
    eventCollection.find({})
    .toArray((err, result) => {
      console.log(err);
      res.send(result);
    })
  })

  app.get('/products/:id', (req, res) =>{
    const productId = req.params.id
    eventCollection.find({_id:ObjectID(productId)})
    .toArray((err, result) =>{
      console.log(err)
      res.send(result)
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    const pdId = req.params.id
    eventCollection.deleteOne({_id:ObjectID(pdId)})
    .then(response => {
      console.log(response)
      res.send(response.deletedCount > 0)
    })
  })


  app.post('/addEvent', (req, res)=>{
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
      console.log('insert result', result.insertedCount)
      res.send(result.insertedCount > 0);
    })

  })
});


app.listen(process.env.PORT || port)