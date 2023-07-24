const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());



// collageAdmission
// collage


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.czi3ubs.mongodb.net/?retryWrites=true&w=majority`;
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
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const userscollection = client.db("Collage-Admision").collection("users");
        const CollageCollection = client.db("collageAdmission").collection("collage");
        const admissionInfo = client.db("collageAdmission").collection("admission");



        app.post('/jwt', (req, res) => {
            console.log('hit jwt')
            const user = req.body;
            console.log('from user /jwt', user)
            console.log(process.env.JWT_ACCESS_TOCKEN)
            const token = jwt.sign(user, process.env.JWT_ACCESS_TOCKEN, { expiresIn: '50h' })
            res.send({ token })
        })


        app.get('/collage', async (req, res) => {
            const result = await CollageCollection.find().toArray()
            res.send(result)
        })
        app.get('/myadmissionInfo/:email' , async(req , res)=>{
            const email=req.params.email;
            const query = {candidateEmail: email}
            const result=await admissionInfo.find(query).toArray()
            console.log(result);
            res.send(result)
        })
        app.get('/myadmissioncollage/:collageId' , async(req , res)=>{
            const id=req.params.collageId;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result=await CollageCollection.find(query).toArray()
            console.log(result);
            res.send(result)
        })
        app.post('/admissionInfo' , async(req , res)=>{
            const studentInfo=req.body
            // console.log(studentInfo)
            const result=await admissionInfo.insertOne(studentInfo);
            res.send(result)
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Collage Admission Info')
})






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})