import { faCircleHalfStroke, faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '../styles/AccessibilityFloater.css';
import { useAccessibility } from '../contexts/AccessibilityContext';

function AccessibilityFloater() {
    const { lightMode, setLightMode } = useAccessibility();

    return (
        <div className="floater-wrapper">
            <div className="floater-body">
                <div className="floater-icon">
                    <FontAwesomeIcon icon={faUniversalAccess} />
                </div>
                <ul className="floater-options">
                    <li className="floater-option button" data-toggled={lightMode} onClick={() => setLightMode(!lightMode)}>
                        <FontAwesomeIcon className="floater-option-icon" icon={faCircleHalfStroke} />
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AccessibilityFloater;