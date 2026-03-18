import React from 'react';
import { useWidget } from 'mcp-use/react';
import { Product } from '../src/types';

export default function ProductGridWidget() {
  // Access everything from useWidget
  const widget = useWidget();
  const { props, output, isPending } = widget;
  
  // Try all possible data paths in mcp-use
  const items = (props?.items || (output as any)?.items || (Array.isArray(props) ? props : null)) as Product[];

  if (isPending) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#666', background: '#f9f9f9' }}>Searching catalog...</div>;
  }

  if (!items || !Array.isArray(items)) {
    return (
      <div style={{ padding: '20px', border: '2px solid red', borderRadius: '8px', background: '#fff0f0' }}>
        <h3 style={{ color: 'red', margin: 0 }}>Debug: Data Missing</h3>
        <p>Widget is connected but "items" array was not found.</p>
        <div style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
          <strong>Props:</strong>
          <pre>{JSON.stringify(props, null, 2)}</pre>
          <strong>Output:</strong>
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '16px',
      padding: '16px',
      background: '#fff',
      fontFamily: 'sans-serif'
    }}>
      {items.map((product) => (
        <div key={product.id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px' }}>{product.name}</h4>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>${product.price?.toFixed(2)}</p>
          <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>ID: {product.id}</div>
        </div>
      ))}
    </div>
  );
}

export const widgetMetadata = {
  name: "productgridwidget",
  description: "Displays a grid of products for discovery.",
  metadata: {
    csp: {
      connectDomains: ["https://petite-flowers-return.loca.lt"],
      resourceDomains: ["https://petite-flowers-return.loca.lt"]
    }
  }
}
