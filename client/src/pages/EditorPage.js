import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Container,
  Card,
  Badge,
  Row,
  Col,
  Form,
  Alert,
} from "react-bootstrap";
import VersionHistory from "../components/VersionHistory";
import ActiveCollaborators from "../components/ActiveCollaborators";
import { BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';

function getColorForUser(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

export default function EditorPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const username = user?.username || "Anonymous";
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [versions, setVersions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [inviteUser, setInviteUser] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [documentOwner, setDocumentOwner] = useState("");
  const [error, setError] = useState("");
  const [isUserActive, setIsUserActive] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const quillRef = useRef(null);
  const activityTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5
    });

    socketRef.current = socket;

    // Socket connection events
    socket.on('connect', () => {
      console.log('Socket connected');
      setSocketConnected(true);
      setError("");
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError("Failed to connect to real-time server");
      setSocketConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setSocketConnected(false);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setSocketConnected(true);
      setError("");
      // Rejoin document room after reconnection
      socket.emit("join-document", { docId: id, username });
    });

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      setError("Connection lost. Attempting to reconnect...");
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      setError("Failed to reconnect to real-time server");
    });

    // Load document data
    API.get(`/documents/${id}`)
      .then((res) => {
        setContent(res.data.content);
        setTitle(res.data.title);
        setIsOwner(res.data.ownerUsername === username);
        setDocumentOwner(res.data.ownerUsername);
        setCollaborators(res.data.collaboratorsUsernames || []);
        
        // Add owner to active users list if they're not already there
        if (res.data.ownerUsername && !activeUsers.includes(res.data.ownerUsername)) {
          setActiveUsers(prev => [...prev, res.data.ownerUsername]);
        }
      })
      .catch(() => setError("Failed to load document"));

    API.get(`/documents/${id}/versions`).then((res) => setVersions(res.data));

    // Join document room when socket is connected
    socket.on('connect', () => {
      socket.emit("join-document", { docId: id, username });
    });

    // Document events
    socket.on("document", (data) => setContent(data));
    socket.on("receive-changes", (data) => {
      if (typeof data === 'string') {
        // Handle legacy format
        setContent(data);
      } else {
        // Handle new format - only update content if it's from another user
        if (data.username !== username) {
          setContent(data.delta);
        }
      }
    });
    socket.on("user-joined", (name) => {
      setCollaborators((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setActiveUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
    });
    socket.on("user-left", (name) => {
      setCollaborators((prev) => prev.filter((n) => n !== name));
      setActiveUsers((prev) => prev.filter((n) => n !== name));
    });
    socket.on("active-users-update", (users) => {
      setActiveUsers(users);
    });

    return () => {
      // Cleanup socket events
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('reconnect');
      socket.off('reconnect_error');
      socket.off('reconnect_failed');
      socket.off("document");
      socket.off("receive-changes");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("active-users-update");
      
      // Disconnect socket
      socket.disconnect();
      
      // Clear activity timeout
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
    // eslint-disable-next-line
  }, [id, username]);

  // Ensure current user is always included in active users list
  useEffect(() => {
    if (username && !activeUsers.includes(username)) {
      setActiveUsers(prev => [...prev, username]);
    }
  }, [username]); // Removed activeUsers dependency to prevent infinite loop

  // Add current user to active users list when component mounts
  useEffect(() => {
    if (username && socketConnected) {
      setActiveUsers(prev => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    }
  }, [username, socketConnected]);

  // Ensure document owner is always included in active users list
  useEffect(() => {
    if (documentOwner && !activeUsers.includes(documentOwner)) {
      setActiveUsers(prev => [...prev, documentOwner]);
    }
  }, [documentOwner]);


  const handleChange = (value, delta, source, editor) => {
    // Only update content if the change is from user input
    if (source === 'user') {
      setContent(value);
      
      // Only emit socket events if connected
      if (socketRef.current && socketConnected) {
        // Mark user as active
        if (!isUserActive) {
          setIsUserActive(true);
          socketRef.current.emit("user-activity", { username, isActive: true });
        }
        
        // Reset activity timeout
        if (activityTimeoutRef.current) {
          clearTimeout(activityTimeoutRef.current);
        }
        
        // Set timeout to mark user as inactive after 30 seconds of no activity
        activityTimeoutRef.current = setTimeout(() => {
          setIsUserActive(false);
          socketRef.current.emit("user-activity", { username, isActive: false });
        }, 30000);
        
        // Send changes to other users
        socketRef.current.emit("send-changes", {
          delta: value,
          username: username
        });
      }
    }
  };

  const handleEditorFocus = () => {
    // Mark user as active when they focus on the editor
    if (!isUserActive && socketRef.current && socketConnected) {
      setIsUserActive(true);
      socketRef.current.emit("user-activity", { username, isActive: true });
    }
  };

  const handleEditorBlur = () => {
    // Mark user as inactive when they blur the editor
    if (isUserActive && socketRef.current && socketConnected) {
      setIsUserActive(false);
      socketRef.current.emit("user-activity", { username, isActive: false });
    }
    
    // Clear activity timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
  };



  const save = async () => {
    await API.put(`/documents/${id}`, { content });
    API.get(`/documents/${id}/versions`).then((res) => setVersions(res.data));
    alert("Saved!");
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/documents/${id}/invite`, {
        username: inviteUser,
      });
      setInviteMsg(res.data.msg);
      setInviteUser("");
      setCollaborators((prev) =>
        prev.includes(inviteUser) ? prev : [...prev, inviteUser]
      );
    } catch (err) {
      setInviteMsg(err.response?.data?.msg || "Error");
    }
  };

  const revert = async (versionId) => {
    await API.post(`/documents/${id}/revert`, { versionId });
    API.get(`/documents/${id}`).then((res) => setContent(res.data.content));
    API.get(`/documents/${id}/versions`).then((res) => setVersions(res.data));
    setShowHistory(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#181c20" }}>
      {/* Topbar */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1">ReplitCollab</span>
        <span className="text-light">
          Logged in as <b>{username}</b>
        </span>
      </nav>

      <Container fluid className="py-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {!socketConnected && (
          <Alert variant="warning">
            Connecting to real-time server... Please wait.
          </Alert>
        )}
        <Row>
          {/* Sidebar */}
          <Col md={3} className="mb-3">
            <Card bg="dark" text="light" className="mb-3">
              <Card.Body>
                <Card.Title>Collaborators</Card.Title>
                <div className="mb-2">
                  {collaborators.map((name) => (
                    <Badge
                      key={name}
                      style={{
                        background: getColorForUser(name),
                        color: "#222",
                        marginRight: 6,
                        fontSize: 16,
                        padding: "0.5em 0.8em",
                      }}
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
                {isOwner && (
                  <Form onSubmit={handleInvite} className="d-flex">
                    <Form.Control
                      value={inviteUser}
                      onChange={(e) => setInviteUser(e.target.value)}
                      placeholder="Invite by username"
                      className="mr-2"
                      required
                    />
                    <Button type="submit" variant="primary">
                      Invite
                    </Button>
                  </Form>
                )}
                {inviteMsg && <div className="mt-2 text-info">{inviteMsg}</div>}
              </Card.Body>
            </Card>
            <Card bg="dark" text="light">
              <Card.Body>
                <Card.Title>Document</Card.Title>
                <div>
                  <b>Title:</b> {title}
                </div>
                <div>
                  <b>Owner:</b> {isOwner ? "You" : ""}
                </div>
                <Button
                  variant="info"
                  className="mt-3"
                  onClick={() => setShowHistory(true)}
                  block
                >
                  Version History
                </Button>
                <Button variant="secondary" className="mt-2" href="/" block>
                  Back to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Editor */}
          <Col md={9}>
            <Card
              style={{
                minHeight: "80vh",
                background: "#23272e",
                border: "none",
                boxShadow: "0 0 24px #0008",
                position: "relative",
              }}
            >
              <Card.Body>
                {/* Active Users */}
                <ActiveCollaborators 
                  activeUsers={activeUsers} 
                  currentUser={username} 
                  documentOwner={documentOwner}
                />
                
                <ReactQuill
                  value={content}
                  onChange={handleChange}
                  onFocus={handleEditorFocus}
                  onBlur={handleEditorBlur}
                  style={{
                    height: "65vh",
                    background: "#181c20",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  theme="snow"
                  ref={quillRef}
                />
                <div className="mt-4 d-flex">
                  <Button variant="success" onClick={save}>
                    Save
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <VersionHistory
          show={showHistory}
          onHide={() => setShowHistory(false)}
          versions={versions}
          onRevert={revert}
        />
      </Container>
    </div>
  );
}
