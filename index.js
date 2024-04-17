// Supports ES6
import { create } from 'venom-bot';
import OpenAI from 'openai';
import { config } from 'dotenv';

config();

// Initialize OpenAI configuration
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });create({
  session: 'session-name' //name of session
})
.then((client) => start(client))
.catch((error) => {
  console.error('Error initializing Venom:', error);
});

function start(client) {
  client.onMessage((message) => {
    console.log(message);
    if (message.body === 'Hi' && !message.isGroupMsg) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); // return object success
        })
        .catch((error) => {
          console.error('Error when sending:', error); // return object error
        });
    } else {
        console.log('Else')
      // Use OpenAI to generate a response
      openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{"role": "system", "content": `You are a helpful assistant. ${message.body}`}],
    })
    .then((response) => {
    const generatedText = response.choices[0].message.content;
    client.sendText(message.from, generatedText);
    })
    .catch((error) => {
    console.error('Error when sending OpenAI response:', error);
    });
    }
  });
}