import React from 'react';
import { useWidget } from 'mcp-use/react';
import { Product } from '../src/types';

export default function ProductCardWidget() {
  const widget = useWidget();
  const { props, output, isPending } = widget;
  
  const product = (props?.product || (output as any)?.product || props) as Product;
  const isValidProduct = product && typeof product === 'object' && ('name' in product || 'id' in product);

  if (isPending) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Loading...</div>;
  }

  if (!isValidProduct) {
    return (
      <div style={{ padding: '20px', border: '2px solid red', borderRadius: '8px', background: '#fff0f0' }}>
        <h3 style={{ color: 'red', margin: 0 }}>Debug: Product Missing</h3>
        <p>Widget is connected but "product" data was not found.</p>
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
      maxWidth: '450px',
      margin: '16px auto',
      border: '1px solid #eee',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif'
    }}>
      <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
      <div style={{ padding: '20px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{product.name}</h2>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>{product.category} • {product.color}</div>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.5', color: '#444' }}>{product.description}</p>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${product.price?.toFixed(2)}</div>
      </div>
    </div>
  );
}

export const widgetMetadata = {
  name: "productcardwidget",
  description: "Displays a detailed product card.",
  metadata: {
    csp: {
      connectDomains: ["https://petite-flowers-return.loca.lt"],
      resourceDomains: ["https://petite-flowers-return.loca.lt"]
    }
  }
}
