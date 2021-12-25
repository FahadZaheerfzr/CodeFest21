const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();

app.get("/", (req, res)=> {
    res.send("I have listened");
});
app.post("/dialogflow", express.json(), (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    let intentMap = new Map();
    intentMap.set("help", welcome);
    agent.handleRequest(intentMap);
});

function welcome(agent) {
    agent.add('Hi, I am assistant. I can help you in various service. How can I help you today?');
}


function defaultFallback(agent) {
    agent.add('Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me.');
}
app.listen(process.env.PORT || 8080,()=>{
    console.log("Listening on port 8080");
});
