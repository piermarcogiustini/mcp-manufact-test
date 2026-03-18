import React from 'react';
import { useWidget } from 'mcp-use/react';

export default function CharacterCard() {
  const { props } = useWidget();
  const { name, id } = (props as any) || {};

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
      <h3>{name || 'Unknown'}</h3>
      <p>ID: {id ?? 'N/A'}</p>
    </div>
  );
}

export const widgetMetadata = {
  name: "charactercard",
  description: "Displays a simple character card.",
  metadata: {
    csp: {
      connectDomains: ["https://petite-flowers-return.loca.lt"],
      resourceDomains: ["https://petite-flowers-return.loca.lt"]
    }
  }
}
