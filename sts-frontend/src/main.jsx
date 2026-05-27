import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/lexend';
import '@fontsource-variable/martian-mono';
import '@fontsource-variable/quicksand';
import '@fontsource-variable/dancing-script';
import '@fontsource/anton';
import '@fontsource/oswald';
import '@fontsource/lobster';
import App from './App.jsx';
import Lenis from 'lenis';
import { AccessibilityProvider } from './contexts/AccessibilityContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AccessibilityProvider>
            <App />
        </AccessibilityProvider>
    </StrictMode>,
)

// Lenis
const lenis = new Lenis({ 
    smoothWheel: true, 
    lerp: 0.1, 
})

function raf(time) {   
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)