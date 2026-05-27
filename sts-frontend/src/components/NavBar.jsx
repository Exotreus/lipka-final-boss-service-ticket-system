import React from 'react';
import '../styles/NavBar.css';
import { Link } from 'react-router-dom';
import NavBarLink from './NavBarLink';
import { faClipboardList, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';

function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 flex justify-between items-center z-[1000]">
            <div className="nav-links flex-1 h-full flex justify-end items-center gap-[1rem]">
                <NavBarLink path={"tickets"} label="List" icon={faClipboardList} />
                <div className="nav-link-separator h-[50%] w-[0.2rem]"></div>
                <NavBarLink path={"tickets/create"} label="Create" icon={faFileCirclePlus} />
            </div>
        </nav>
    )
}

export default NavBar;