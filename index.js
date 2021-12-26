const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const mongoose = require("mongoose");
const [ProductModel,TicketModel] = require("./schema");
const app = express();

mongoose.connect(
    `mongodb+srv://CodeFest21:CodeFest%4021@codefestcluster.f8iws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


app.get("/get_product_byname/:name", async (request, response) => {
    const product = await ProductModel.find({name:request.params.name});
  
    try {
        response.send(product);
      } catch (error) {
        response.status(500).send(error);
      }
});
app.get("/get_product_byprice/:price", async (request, response) => {
    const product = await ProductModel.find({price:request.params.price});
  
    try {
        response.send(product);
      } catch (error) {
        response.status(500).send(error);
      }
});
app.get("/get_product_byid/:itemid", async (request, response) => {
    console.log(request.params.itemid)
    const product = await ProductModel.find({itemid:request.params.itemid});
  
    try {
        response.send(product);
      } catch (error) {
        response.status(500).send(error);
      }
});


app.get("/add_ticket", async (request, response) => {
    const product = new TicketModel({number:2});
  
    try {
      await product.save();
      response.send(product);
    } catch (error) {
      response.status(500).send(error);
    }
});



app.get("/getTicket/:num", async (req, response) => {
    const ticket = await TicketModel.find({number:req.params.num});
    try {
      response.send(ticket);
    } catch (error) {
      response.status(500).send(error);
    }
  });

app.get("/", (req, res) => {
    res.send("I have listened");
});

app.post("/dialogflow", express.json(), (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    console.log("\n\n\n\n");
    
    let intentMap = new Map();
    intentMap.set("help", welcome);
    intentMap.set("createUser - custom - custom", createUser);
    agent.handleRequest(intentMap);
});

function createUser(agent){
    console.log(agent);
    console.log(agent.body.queryResult.outputContexts[1].parameters);
    agent.add('I am working on it. your account will be created shorly.')
}

function welcome(agent) {
    agent.add('Hi, I am assistant. I can help you in various service. How can I help you today?');
}


function defaultFallback(agent) {
    agent.add('Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me.');
}
app.listen(process.env.PORT || 8080, () => {
    console.log("Listening on port 8080");
});
