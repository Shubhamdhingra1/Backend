import React from 'react';
import { Badge } from 'react-bootstrap';
import './ActiveCollaborators.css';

const ActiveCollaborators = ({ activeUsers, currentUser }) => {
  console.log('ActiveCollaborators received:', { activeUsers, currentUser });
  
  // Show all active users including the current user
  const allActiveUsers = activeUsers;

  console.log('All active users:', allActiveUsers);

  if (allActiveUsers.length === 0) {
    return (
      <div className="active-collaborators" style={{ opacity: 0.5 }}>
        <div className="active-collaborators-header">
          <span className="active-indicator" style={{ background: '#666' }}></span>
          <span className="active-text" style={{ color: '#666' }}>Active Users:</span>
        </div>
        <div className="collaborators-list">
          <span style={{ color: '#666', fontSize: '12px' }}>No users currently active</span>
        </div>
      </div>
    );
  }

  return (
          <div className="active-collaborators">
        <div className="active-collaborators-header">
          <span className="active-indicator"></span>
          <span className="active-text">Active Users:</span>
        </div>
      <div className="collaborators-list">
        {allActiveUsers.map((username) => (
          <Badge
            key={username}
            className="collaborator-badge"
            style={{
              background: getColorForUser(username),
              color: "#222",
              marginRight: 8,
              fontSize: 14,
              padding: "6px 12px",
              borderRadius: "20px",
              fontWeight: "500",
              border: username === currentUser ? "2px solid #fff" : "none",
              boxShadow: username === currentUser ? "0 0 8px rgba(255,255,255,0.3)" : "none"
            }}
          >
            {username === currentUser ? `${username} (You)` : username}
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Color generation function (same as in EditorPage)
function getColorForUser(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

export default ActiveCollaborators; 