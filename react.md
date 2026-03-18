# mcp-use React Widget Fixes & Findings

This document summarizes the changes made to resolve the issue where React widgets were not rendering or populating data correctly in the `mcp-use` Inspector.

## 1. Tool Registration: `widget` Property
**Issue:** Registering a tool with a string for the `widget` property (e.g., `widget: "mywidget"`) is deprecated or insufficient in newer versions of the SDK. It fails to generate the necessary `annotations` in the tool definition sent to the client.

**Fix:** Changed the `widget` property to use the `ToolWidgetConfig` object format.
```typescript
// BEFORE (Broken)
server.tool({
  name: "my_tool",
  widget: "productcardwidget",
}, ...)

// AFTER (Fixed)
server.tool({
  name: "my_tool",
  widget: {
    name: "productcardwidget",
  },
}, ...)
```

## 2. Case-Sensitivity & URIs
**Issue:** The `mcp-use` CLI/Inspector generates resource URIs using **lowercase** filenames (e.g., `ui://widget/productcardwidget.html`). If the server registers a widget with PascalCase (e.g., `ProductCardWidget`), the bridge may fail to mount the component or associate the tool result.

**Fix:** 
- Renamed files in `resources/` to lowercase (e.g., `productcardwidget.tsx`).
- Updated all references in `src/server.ts` to use lowercase.

## 3. Data Consumption: `useWidget` Hook
**Issue:** `mcp-use` widgets **do not** receive data via standard React props. Data is delivered asynchronously via an internal bridge.

**Fix:** Refactored components to use the `useWidget` hook.
```tsx
import { useWidget } from 'mcp-use/react';

export default function MyWidget() {
  const { props, output, isPending } = useWidget();
  
  // Robust extraction logic (handles different delivery paths)
  const data = props?.data || output?.structuredContent?.data;
  
  if (isPending) return <div>Loading...</div>;
  // ... render
}
```

## 4. Runtime Dependencies
**Issue:** The widgets execute in a browser-like sandbox. If `react` and `react-dom` are not explicitly listed in the project's `dependencies`, the bundler may fail to include them or provide them to the entry points in `.mcp-use/`.

**Fix:** Added `react` and `react-dom` to `package.json` dependencies.

## 5. Summary of Findings
- **Discovery**: Use `npx mcp-use dev` to see how the CLI interprets your `resources/` folder.
- **Protocol**: The bridge connects via `postMessage`. If `hasProps` and `hasOutput` are true but your component is blank, the issue is likely a JavaScript crash inside the widget (e.g., mapping over undefined) or a mismatch in the JSON key path.
## 6. Content Security Policy (CSP)
**Issue:** Widgets may fail to load scripts or make network requests if the host (e.g., Inspector or ChatGPT) enforces a strict CSP. This often happens when using tunnels like Localtunnel or custom domains.

**Fix:** Explicitly declare allowed domains in the tool's `_meta` or the widget's `widgetMetadata`.

**Server-side Fix (Recommended):**
Add `_meta` with `appsSdkMetadata` to your `server.tool` definition.
```typescript
const CSP_CONFIG = {
  appsSdkMetadata: {
    "openai/widgetCSP": {
      connect_domains: ["https://your-domain.loca.lt"],
      resource_domains: ["https://your-domain.loca.lt"]
    }
  }
};

server.tool({
  name: "my_tool",
  widget: { name: "my_widget" },
  _meta: CSP_CONFIG
}, ...)
```

**Widget-side Fix:**
Add `metadata.csp` to your `widgetMetadata` export.
```tsx
export const widgetMetadata = {
  name: "my_widget",
  metadata: {
    csp: {
      connectDomains: ["https://your-domain.loca.lt"],
      resourceDomains: ["https://your-domain.loca.lt"]
    }
  }
}
```
*Note: `mcp-use` automatically transforms camelCase `connectDomains` to snake_case `connect_domains` when sending to ChatGPT.*
