import React from 'react';
import { Badge } from 'react-bootstrap';
import './ActiveCollaborators.css';

const ActiveCollaborators = ({ collaborators, currentUser }) => {
  // Filter out the current user from the list
  const otherCollaborators = collaborators.filter(user => user !== currentUser);

  if (otherCollaborators.length === 0) {
    return null;
  }

  return (
    <div className="active-collaborators">
      <div className="active-collaborators-header">
        <span className="active-indicator"></span>
        <span className="active-text">Active Collaborators:</span>
      </div>
      <div className="collaborators-list">
        {otherCollaborators.map((username) => (
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
              fontWeight: "500"
            }}
          >
            {username}
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