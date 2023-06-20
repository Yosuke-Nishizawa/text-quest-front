import { ChatGPTAPI } from "chatgpt";

export function newApi(role = null, preMessages = []) {
  // const roleSetting = role ? role : "You are a helpful assistant.";
  // const preMessageSettings = preMessages.map((preMessage) => {
  //   return { role: "user", content: preMessage };
  // });
  const completionParams = {
    // model: "gpt-4",
    model: "gpt-3.5-turbo",
    temperature: 1,
    top_p: 1,
    // messages: [{ role: "system", content: roleSetting }, ...preMessageSettings],
  };
  console.log(completionParams);
  return new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    completionParams,
  });
}
