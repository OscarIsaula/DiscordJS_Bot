import OpenAI from 'openai';

class ChatGPT {

  askChatGPT = async (message) => {

    const openai = new OpenAI({
      apiKey: process.env.CHATGPT_TOKEN
    });

    const response = await openai.responses.create({
      model: 'gpt-5.6',
      input: message
    });

    return response.output_text;
  };
}

export default ChatGPT;