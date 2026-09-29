import OpenAI from 'openai';

class ChatGPT {

  askChatGPT = async (message) => {

    try {

      await message.channel.sendTyping();

      // Fetch the last 10 messages from the channel
      const rawMessages = await message.channel.messages.fetch({ limit: 10 });

      // Convert Discord messages into a readable conversation log
      const conversationLog = [...rawMessages.values()]
        .reverse()
        .map(msg => {
          const author = msg.author.bot ? 'Bot' : msg.author.username;
          return `${author}: ${msg.content}`;
        })
        .join('\n');

      // Create OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.CHATGPT_TOKEN
      });

      const response = await openai.responses.create({

        model: 'gpt-5.6',

        tools: [
          {
            type: 'web_search'
          }
        ],

        tool_choice: 'auto',

        input: `
Keep your response under 1800 characters.
This is important because Discord has a 2000-character message limit.

Be concise when necessary. Do not sacrifice important information,
but summarize or shorten your response if it would otherwise exceed
the character limit.

Here is the recent conversation in this channel:

${conversationLog}

The user's current message is:

${message.content}

Respond naturally to the user's current message.
Use the previous messages only as context.
`
      });

      let responseText = response.output_text;

      // Final safety limit for Discord's 2000-character maximum
      if (responseText.length > 1900) {
        responseText = responseText.substring(0, 1900) + '...';
      }

      return responseText;

    } catch (error) {

      console.error('ChatGPT Error:', error);

      return 'Sorry, I ran into an error while generating a response.';
    }
  };
}

export default ChatGPT;