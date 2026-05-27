import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/NavBarLink.css';

function NavBarLink({path, label, icon = null}) {
    return (
        <div className="nav-link-wrapper select-none h-full flex flex-col justify-center items-center">
            <Link to={path} className="nav-link flex-1 flex justify-center items-center gap-[1rem] text-center">
                <p className="nav-link-label text-[1rem]">{label}</p>
                {icon && <FontAwesomeIcon icon={icon} className="nav-link-icon text-[1.25rem]" />}
            </Link>
        </div>
    )
}

export default NavBarLink;