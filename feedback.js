async function updateIntent(newTrainingPhrases) {
    // Imports the Dialogflow library
    const dialogflow = require("dialogflow");
  
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient();
    const intent = existingIntent; //intent that needs to be updated
  
    const trainingPhrases = [];
    let previousTrainingPhrases =
      existingIntent.trainingPhrases.length > 0
        ? existingIntent.trainingPhrases
        : [];
  
    previousTrainingPhrases.forEach(textdata => {
      newTrainingPhrases.push(textdata.parts[0].text);
    });
  
    newTrainingPhrases.forEach(phrase => {
      const part = {
        text: phrase
      };
  
      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: "EXAMPLE",
        parts: [part]
      };
      trainingPhrases.push(trainingPhrase);
    });
    intent.trainingPhrases = trainingPhrases;
    const updateIntentRequest = {
      intent,
      languageCode: "en-US"
    };
  
    // Send the request for update the intent.
    const result = await intentsClient.updateIntent(updateIntentRequest);
  
    return result;
  }

  export default updateIntent;