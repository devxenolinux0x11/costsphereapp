// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './index.css';

function App() {
    const [expanded, setExpanded] = useState(false);

    return (
        <Router>
            <div className="app-container">
                <Navbar bg="light" expand="lg" fixed="top" expanded={expanded} className="main-nav">
                    <Container>
                        <Navbar.Brand as={Link} to="/" className="brand" onClick={() => setExpanded(false)}>
                            {/*<FiGlobe className="brand-icon" />*/}
                            ＣｏｓｔＳｐｈｅｒｅ
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link as={Link} to="/login" className="auth-link" onClick={() => setExpanded(false)}>Sign In</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="auth-link highlight" onClick={() => setExpanded(false)}>Register</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <main className="main-content"> {/* Added a main element */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </main>

                <footer className="main-footer">
                    <Container>
                        <p>&copy; 2025 CostSphere: Global & Indian Living Insights </p>
                    </Container>
                </footer>
            </div>
        </Router>
    );
}

export default App;
