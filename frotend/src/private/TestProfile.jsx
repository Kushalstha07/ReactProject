import React from 'react';

function TestProfile() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Test Profile Page</h1>
      <p>If you can see this, routing is working!</p>
      <div style={{ background: '#f0f0f0', padding: '20px', margin: '20px 0', borderRadius: '8px' }}>
        <h3>Debug Information:</h3>
        <p>✅ Profile route is accessible</p>
        <p>✅ Component is rendering</p>
        <p>✅ No JavaScript errors</p>
      </div>
    </div>
  );
}

export default TestProfile; 