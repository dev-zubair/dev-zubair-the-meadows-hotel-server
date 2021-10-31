const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require("cors");
require("dotenv").config();

const port = 5000;
const app = express();

//user - myHotel
//pass - MhCEaTuVRyQExLIY

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m3bow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Welcome to my server");
});

async function run() {
    try {
        await client.connect();
        const database = client.db('hotelBooking');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('bookingOrder');

        //Get Api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })


        // Post or Add Service Api
        app.post('/addservice', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            // console.log('got new service', req.body);
            // res.send('add service', result);
            res.json(result);

        });

        // Book a order
        app.post('/addOrder', (req, res) => {
            console.log(req.body);
            orderCollection.insertOne(req.body).then((result) => {
                res.send(result);
            })
        });


        // My Order

        app.get("/myOrder/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // Get All Order

        app.get("/allOrder", async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });


        // Delete Order

        app.delete("/deleteOrder/:id", async (req, res) => {
            // console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(process.env.PORT || port);