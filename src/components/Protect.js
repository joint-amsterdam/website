// src/components/Protect.js
import React, { useState } from 'react';

const Protect = ({ hash, children, blur = false }) => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [input, setInput] = useState('');

  const sha512 = async (str) => {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-512', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputHash = await sha512(input);
    if (inputHash === hash) {
      setAccessGranted(true);
    } else {
      alert('Incorrect password');
      setInput('');
    }
  };

  if (accessGranted) return children;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backdropFilter: blur ? 'blur(8px)' : 'none',
        flexDirection: 'column',
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>
          Unlock
        </button>
      </form>
    </div>
  );
};

export default Protect;
