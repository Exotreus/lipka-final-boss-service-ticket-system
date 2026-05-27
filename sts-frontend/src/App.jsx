import React, { useEffect } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import TicketsPage from './pages/TicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAccessibility } from './contexts/AccessibilityContext';
import AccessibilityFloater from './components/AccessibilityFloater';

function App() {
    const { lightMode } = useAccessibility();

    useEffect(() => {
        document.body.setAttribute('data-light', lightMode);
    }, [lightMode]);

    return (
        <Router>
            <NavBar />
            <AccessibilityFloater />

            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/tickets" />} />
                    <Route path="/tickets" element={<TicketsPage />} />
                    <Route path="/tickets/create" element={<NewTicketPage />} />
                    <Route path="/tickets/:id" element={<TicketDetailsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;