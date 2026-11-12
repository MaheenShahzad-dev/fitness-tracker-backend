let groq=require('groq-sdk');
require('dotenv').config();
const client = new groq({
  apiKey: process.env['GROQAPIKEY'], 
});


 
exports.getGroq=async (req,res)=>{
  try{
     let {query} = req.query; 
console.log(query)
    if (!query) {
        return res.status(400).json({ error: "Missing 'text' query parameter" });
    }

    const chatCompletion = await client.chat.completions.create({
      
  messages: [{  role: 'system',
          content: 'You are a strict fitness assistant for a fitness tracker website. ' +
                   'You only answer questions directly related to fitness, workouts, nutrition, health, and exercise. ' +
                   'If the user asks about any other topic (such as coding, history, jokes, politics, or general knowledge), ' +
                   'politely refuse and remind them that you can only help with fitness-related queries.'
        },{ role: 'user', content: query }],
  model: 'openai/gpt-oss-20b',
});
 res.json({"status":"success", chat:chatCompletion.choices[0].message.content})


  }
   catch (e) {
        res.status(500).json({ "message": `error ${e.message}` });

    }
   
}