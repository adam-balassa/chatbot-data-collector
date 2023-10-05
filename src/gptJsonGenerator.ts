export async function generateJsonResponses(sites: string[], contents: unknown[]): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    const { ChatGPTAPI } = await import('chatgpt');
    const chatGptApi = new ChatGPTAPI({
      apiKey: apiKey,
    });

    const baseQuestion = 'What is the best way to store below data in a JSON structured data model?\n';
    const jsonResponses: string[] = [];
    for (const content of contents) {
      const fullQuestion = baseQuestion + '{  ' + String(content) + ' } ';
      const response = await chatGptApi.sendMessage(fullQuestion);
      jsonResponses.push(response.text);
    }

    return jsonResponses;
  }

  return [];
}
