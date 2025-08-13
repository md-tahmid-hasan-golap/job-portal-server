require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
port = process.env.PORT || 3000;



app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8prwai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();


    // job collaction
    const jobCollaction = client.db("jobPortal").collection("jobs")
    const applicationCallaction = client.db("jobPortal").collection("application")


    // get oparation 
    app.get('/jobs', async(req, res) => {
        const result = await jobCollaction.find().toArray()
        res.send(result)
    })


 // jobs Details
 app.get('/jobsDetails/:id', async(req, res) => {
    const id = req.params.id
    const queary = {_id: new ObjectId(id)}
    const result = await jobCollaction.findOne(queary)
    res.send(result)
 })

 // job application
 app.post('/application', async(req,res) => {
    const newApplicant = req.body
    const result = await applicationCallaction.insertOne(newApplicant)
    res.send(result)
 })


 app.get('/application', async(req,res) => {
    const email = req.query.email
    const query = {
        applicantEmail:  email
    }
    const result = await applicationCallaction.find(query).toArray()

    // bad way
    for(const application of result){
        const jobId = application.jobId
        const jonQuery = {_id: new ObjectId(jobId)}
        const job = await jobCollaction.findOne(jonQuery)
         application.company = job.company
         application.title = job.title
          application.company_logo = job.company_logo
    }
    res.send(result)
 })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/', (req, res) => {
  res.send('Job portal cooking!')
})


app.listen(port, () => {
  console.log(`Job portal cooking server is running on port ${port}`)
})