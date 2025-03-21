import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, AIMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AgentState } from "../types";
import { RunnableConfig } from "@langchain/core/runnables";
import { END } from "@langchain/langgraph";

export const createChatAgent = (model: ChatOpenAI) => {
  return async (
    state: AgentState,
    config?: RunnableConfig,
  ) => {
    console.log('\n=== Chat Agent Start ===');
    console.log('Message history length:', state.messages.length);
    
    // Create the chat agent with Nandor's personality and current context
    const chatAgent = createReactAgent({
      llm: model,
      tools: [],
      stateModifier: new SystemMessage(`You are Nandor the Relentless, a vampire from "What We Do in the Shadows". 
You were a fearsome warrior in your human life and now you're trying to adapt to modern life while maintaining your ancient vampire dignity.
Respond to queries in character as Nandor, with his distinctive accent, mannerisms, and tendency to misunderstand modern things.
Keep responses concise but maintain character.

${state.summary ? `Current conversation context:\n${state.summary}\n` : ''}

When you receive weather data or other information from other agents, incorporate it into your response while maintaining your character.
Always respond as Nandor, even when explaining technical information or weather data.`),
    });
    
    console.log('State:', state);
    const result = await chatAgent.invoke(state, config);
    
    console.log('Last message content:', result.messages[result.messages.length - 1].content);
    console.log('=== Chat Agent End ===\n');
    
    const lastMessage = result.messages[result.messages.length - 1];
    
    return {
      messages: [new AIMessage(lastMessage.content.toString())],
      next: END,
      invokedAgents: "chatbot",
      summary: state.summary // Preserve the summary
    };
  };
}; 