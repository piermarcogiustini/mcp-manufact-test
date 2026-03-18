import "dotenv/config";
import { MCPClient, MCPAgent } from "mcp-use";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function runAgent() {
  console.log("🛠️  Initializing MCP Client...");
  
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GOOGLE_API_KEY is not defined in your .env file.");
    return;
  }

  // Use MCPClient.fromDict for correct configuration loading in mcp-use
  const client = MCPClient.fromDict({
    mcpServers: {
      "b2c-product-discovery": {
        url: "http://localhost:3000/sse"
      }
    }
  });

  console.log("🧠 Connecting to Gemini...");

  try {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-3.1-flash-lite-preview", 
      apiKey: apiKey.trim(),
    });

    const agent = new MCPAgent({
      llm: model,
      client: client,
    });

    console.log("🚀 Agent is ready!");
    
    const query = "I am looking for some brown boots for hiking. Can you show me what you have?";
    console.log(`\nUser: ${query}`);
    
    const response = await agent.run(query);
    console.log("\nAI Response:", response.content);

    // Simulate drill-down
    const drillDownQuery = "The first one looks good (ID 1). Can you give me more details about it?";
    console.log(`\nUser: ${drillDownQuery}`);
    const drillDownResponse = await agent.run(drillDownQuery);
    console.log("\nAI Response:", drillDownResponse.content);

  } catch (error) {
    console.error("\n❌ Initialization or Run Error:", error);
  }
}

runAgent().catch(console.error);
