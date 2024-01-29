const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfz3k0z.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db("taskHubConnect").collection('users');
    const taskCollection = client.db("taskHubConnect").collection('tasks');
    const commentsCollection = client.db("taskHubConnect").collection('comments');
    const collaboratorsCollection = client.db("taskHubConnect").collection('collaborators');

 


// Post user data while registration 
    app.post('/users', async(req, res)=> {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })


// Post task data to database
    app.post('/tasks', async(req, res)=> {
        const taskInfo = req.body;
        const result = await taskCollection.insertOne(taskInfo);
        res.send(result);
    })

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    //Delete user (admin dashboard)
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });


      //Make admin (admin route)
  app.patch('/users/admin/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const updatedDoc = {
      $set : {
        role: 'admin'
      }
    }
    const result = await userCollection.updateOne(query, updatedDoc);
    res.send(result)
  });


      //Remove user from admin panel (admin dashboard)
  app.patch('/users/user/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const updatedDoc = {
      $set : {
        role: 'user'
      }
    }
    const result = await userCollection.updateOne(query, updatedDoc);
    res.send(result)
  });



// //Get all tasks data for admin dashboard
//     app.get('/tasks', async (req, res) => {
//       const cursor = taskCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     })


    // Get all task details for specific user
    app.get('/tasks', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email }
      }
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    


    // Task delete api
    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    //Update task status to On-going
    app.patch('/tasks/ongoing/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const updatedDoc = {
        $set : {
          status: 'On-going'
        }
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result)
    });


    //Update task status to Completed
    app.patch('/tasks/completed/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const updatedDoc = {
        $set : {
          status: 'Completed'
        }
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result)
    });


    //Update task info
      app.put('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const updatedData = req.body;
      const updatedDoc = {
        $set : {
          userName: updatedData.userName,
          title: updatedData.title,
          deadline: updatedData.deadline,
          priority: updatedData.priority,
          taskDescription: updatedData.taskDescription,
        }
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    })


    // Post comment data to database
    app.post('/comments', async(req, res)=> {
      const commentInfo = req.body;
      const result = await commentsCollection.insertOne(commentInfo);
      res.send(result);
  })


  //Get comment data by postId
  app.get('/comments/:postId', async (req, res) => {
    const postId = req.params.postId;
    const query = { postId: postId };
    const cursor = commentsCollection.find(query);
    const result = await cursor.toArray();
    res.json(result);
  });


    // Post comment data to database
    app.post('/collaborators', async(req, res)=> {
      const collaboratorsInfo = req.body;
      const result = await collaboratorsCollection.insertOne(collaboratorsInfo);
      res.send(result);
  })


  //Get comment data by postId
  app.get('/collaborators/:collaboratorId', async (req, res) => {
    const collaboratorId = req.params.collaboratorId;
    const query = { collaboratorId: collaboratorId };
    const cursor = collaboratorsCollection.find(query);
    const result = await cursor.toArray();
    res.json(result);
  });




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Task Is Running")
})

app.listen(port, () => {
    console.log(`Task Management server is running ${port}`);
})