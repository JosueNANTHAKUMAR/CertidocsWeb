import React from 'react';

const MailSection = ({ message }) => (
  <div style={{
    padding: '20px',
    background: '#dff0d8',
    border: '2px solid #4CAF50',
    borderRadius: '8px',
    color: '#3c763d',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    margin: '16px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  }}>
    <span style={{ fontSize: '24px' }}>✅</span>
    {message}
  </div>
);

export default MailSection; 