import React from 'react';
import '../styles/pages/NotFoundPage.css';

function NotFoundPage() {
    return (
        <section className="w-full flex-1 flex flex-col justify-center items-center" id="page-notfound">
            <h3 className="font-mono">404</h3>
            <p>This page does not exist.</p>
        </section>
    )
}

export default NotFoundPage;