const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const [ProductModel, TicketModel, UserModel] = require("./schema");
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
var cors = require('cors');
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static('static'))

let WrongResponses = 0;

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
const sessionId = uuid.v4();
async function runSample(messageText, projectId = 'edbot-mjyx') {
  // A unique identifier for the given session
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "./edbot-mjyx-19dda7308a04.json"
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: messageText,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  return result
}




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
  const product = await ProductModel.find({ name: request.params.name });

  try {
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});
app.get("/get_product_byprice/:price", async (request, response) => {
  const product = await ProductModel.find({ price: request.params.price });

  try {
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});
app.get("/get_product_byid/:itemid", async (request, response) => {
  console.log(request.params.itemid)
  const product = await ProductModel.find({ itemid: request.params.itemid });

  try {
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});


app.get("/add_ticket", async (request, response) => {
  const product = new TicketModel({ number: 2 });

  try {
    await product.save();
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/add_user/:name/:number", async (request, response) => {

});



app.get("/getTicket/:num", async (req, response) => {
  const ticket = await TicketModel.find({ number: req.params.num });
  try {
    response.send(ticket);
  } catch (error) {
    response.status(500).send(error);
  }
});



app.post("/dialogflow", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });


  let intentMap = new Map();
  intentMap.set("help", welcome);
  intentMap.set("createUser - custom - custom", createUser);
  agent.handleRequest(intentMap);
});

async function createUser(agent) {
  const username = agent.contexts[1].parameters["person.original"];
  const number = agent.contexts[1].parameters["number.original"];

  if (username && number) {
    const user = new UserModel({ name: username, number: number });

    try {
      await user.save();
      agent.add('Your account has been created. Happy Shopping!');
    } catch (error) {
      response.status(500).send(error);
    }
  }
  else {
    agent.add('It appears something went wrong. Please tell me to generate a ticket if you want');
  }
}

function welcome(agent) {
  agent.add('Hi, I am assistant. I can help you in various service. How can I help you today?');
}


function defaultFallback(agent) {
  agent.add('Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me.');
}

app.get("/send_message/:message", async (req, response) => {
  const result = await runSample(req.params.message);
  console.log((result.fulfillmentText))
  if(result.intent.displayName=="Default Fallback Intent") {
    WrongResponses += 1;
  } else {
    WrongResponses = 0;
    console.log('  No intent matched.');
  }

  if (WrongResponses > 3){
    const product = new TicketModel({ number: parseInt(Math.random()*9999999999 )});

    try {
      await product.save();
      response.send("Sorry I am unable to answer that. I will connect you to a live agent.");
    } catch (error) {
      response.send("Something went wrong! Try again later")
    }
    

    WrongResponses = 0;
  }
  else if(result.intent.displayName=="buy-clothing"){
    response.send("===colors");
  }  else if(result.intent.displayName=="Color"){
    response.send("===size");
  }
  else{
    console.log(result.intent.displayName);
    response.send(`${result.fulfillmentText}`)
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Listening on port 8080");
});

