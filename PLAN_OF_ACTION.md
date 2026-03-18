# Roadmap: Building a Visual MCP "Rick & Morty App"

This study plan uses the **Rick and Morty API** (completely free, no keys required) to master the **Manufact (mcp-use)** SDK.

---

## Phase 1: Environment & API Discovery
**Goal:** Setup the TypeScript workspace and understand the target API.

1.  [x] **Node.js & TS Initialization:** (Completed)
2.  [ ] **API Research:**
    - Use Postman to explore `GET /api/character` (list/search) and `GET /api/character/:id` (details).
    - Map out fields needed for UI: `name`, `status`, `species`, `image`, `origin`.

## Phase 2: Core MCP Server implementation
**Goal:** Implement the logic to fetch data from the API.

1.  [ ] **Tool 1: `search_characters`**
    - Parameters: `name`, `status`, `species`.
    - Logic: Call `https://rickandmortyapi.com/api/character/?name=...`
2.  [ ] **Tool 2: `get_character_details`**
    - Parameters: `id`.
    - Logic: Call `https://rickandmortyapi.com/api/character/:id`.

## Phase 3: Visual UX with React Widgets
**Goal:** Create interactive UI components that render in the LLM chat.

1.  [ ] **Character Card Widget:**
    - Create `resources/character-card.tsx`.
    - Display image, status badge (green for Alive, red for Dead), and origin details.
2.  [ ] **Character Grid Widget:**
    - Create `resources/character-grid.tsx`.
    - Display a visual grid of search results.
3.  [ ] **Server Integration:**
    - Update tools to return `widget()` instead of just `text()`.

## Phase 4: Agent Orchestration & Intelligence
**Goal:** Test the "brain" of the application.

1.  [ ] **Inspector Testing:** Use `npx mcp-use dev` to verify the React components render correctly.
2.  [ ] **Agent logic:** Implement `src/client.ts` to allow an LLM to "talk" to the server.
3.  [ ] **Complex Queries:** Test "Find all characters from Earth that are still Alive and show me their details."

## Phase 5: Polish & Observability
**Goal:** Finalize and monitor the app.

1.  [ ] **Error Handling:** Gracefully handle "No characters found" or API downtime.
2.  [ ] **Langfuse Integration:** Setup observability to track how the agent uses the tools.

---

## Key Technical Goals
- **Zod:** Mastery of input validation schemas.
- **React:** Building data-driven visual widgets for AI.
- **Manufact SDK:** Understanding the bridge between MCP and AI Agents.
