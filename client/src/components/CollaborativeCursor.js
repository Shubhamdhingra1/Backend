import React from 'react';
import './CollaborativeEditor.css';

const CollaborativeCursor = ({ username, position, color }) => {
  if (!position) return null;

  return (
    <div
      className="collaborative-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Cursor line */}
      <div
        className="collaborative-cursor-line"
        style={{
          backgroundColor: color,
        }}
      />
      
      {/* Username label - shows on hover via CSS */}
      <div
        className="collaborative-cursor-label"
        style={{
          backgroundColor: color,
        }}
      >
        {username}
      </div>
    </div>
  );
};

export default CollaborativeCursor; 