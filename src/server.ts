import { MCPServer, text, widget } from 'mcp-use/server';
import { z } from 'zod';
import { PRODUCTS } from './db';

const server = new MCPServer({
  name: 'b2c-product-discovery',
  title: 'B2C Catalog Discovery Agent',
  version: '1.0.0',
  description: 'An autonomous agent for discovering products in a B2C catalog.',
  baseUrl: 'https://petite-flowers-return.loca.lt'
});

const CSP_CONFIG = {
  appsSdkMetadata: {
    "openai/widgetCSP": {
      connect_domains: ["https://petite-flowers-return.loca.lt"],
      resource_domains: ["https://petite-flowers-return.loca.lt"]
    }
  }
};

// Root handler to prevent 404 on tunnel root
server.app.get("/", (c) => c.text("MCP Server is running!"));

server.tool({
  name: "cerca_prodotti",
  description: "Searches the catalog for products. Use this for broad user intent discovery. Returns a visual grid of matching products.",
  schema: z.object({
    categoria: z.enum(['boots', 'sneakers']).describe("Filter items by shoe category."),
    colore: z.string().optional().describe("Filter items by specific color names."),
  }),
  widget: {
    name: "productgridwidget",
  },
  _meta: CSP_CONFIG
}, async (args) => {
  let results = PRODUCTS;
  
  if (args.categoria) {
    results = results.filter(p => p.category === args.categoria);
  }
  
  if (args.colore) {
    results = results.filter(p => p.color.toLowerCase().includes(args.colore!.toLowerCase()));
  }

  return widget({
    props: { items: results },
    output: text(`Found ${results.length} items. Rendering selection grid for the user. I can now provide details on any of these products if you specify their ID or name.`)
  });
});

server.tool({
  name: "dettaglio_prodotto",
  description: "Fetch complete information for a specific product using its ID. This tool returns a detailed product card.",
  schema: z.object({
    id: z.string().describe("The unique identifier of the product."),
  }),
  widget: {
    name: "productcardwidget",
  },
  _meta: CSP_CONFIG
}, async ({ id }) => {
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return text(`Product with ID ${id} not found.`);
  }

  return widget({
    props: { product },
    output: text(`Retrieved full details for ${product.name}. Reasoning: ${product.description}`)
  });
});

// Listen with explicit CORS for remote access
await server.listen(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Mcp-Session-Id", "x-api-key"],
    exposedHeaders: ["Mcp-Session-Id"],
  }
});
