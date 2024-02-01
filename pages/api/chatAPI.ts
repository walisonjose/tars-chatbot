import { ChatBody } from '@/types/types';
import { OpenAIStream, runChat } from '@/utils/chatStream';

export const config = {
  runtime: 'edge',
};


const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputCode, model, apiKey } = (await req.json()) as ChatBody;
    let apiKeyFinal;

    //console.log('inputCode', inputCode);
   // console.log('model', model);

    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    if (!apiKey) {
      return new Response('API key not found', { status: 500 });
    }
    console.log('inputCode==>>', inputCode);

  
   // await OpenAIStream(inputCode, model, apiKeyFinal);
   
;
    new Response(true, { status: 200 });


  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
