import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/TicketsPage.css';
import { getTickets, deleteTicket } from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Capitalize, formatTime } from '../utils/misc';

function TicketsPage() {
    const [ticketsList, setTicketsList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [now, setNow] = useState(Date.now());
    const [error, setError] = useState("");

    async function loadTickets() {
        try {
            const data = await getTickets();
            setTicketsList(data);
        } catch (err) {
            setError("Could not load tickets from server.");
        }
    }

    useEffect(() => {
        loadTickets();
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function toggleSelect(id) {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    }

    async function handleMassDelete() {
        if (selected.length < 1) return;
        try {
            for (const id of selected) {
                await deleteTicket(id);
            }
            setSelected([]);
            await loadTickets();
        } catch (err) {
            setError("Error processing multiple deletions.");
        }
    }

    return (
        <section id="page-tickets">
            <h1 className="text-[10rem] font-bold">Service Tickets</h1>

            {error && <p className="error-message">{error}</p>}

            <div className="delete-multiple-container flex flex-col justify-center items-center w-full" data-hidden={selected.length < 1}>
                <button onClick={handleMassDelete}>
                    <p className="button-text">
                        Delete <span className="text-color-main font-mono">{selected.length}</span> Selected
                    </p>
                </button>
            </div>

            {ticketsList.length < 1 && 
                <p className="add-some">
                    Create some tickets!
                </p>
            }

            <ul className="tickets-list flex flex-col justify-center items-center gap-[1rem] min-w-[50vw] max-w-[90vw] p-[1rem]">
                {ticketsList.map(ticket => (
                    <li className="list-ticket select-none w-full h-[8rem] flex justify-center items-center gap-[1rem]" key={ticket.id}>
                        <div
                            className="checkbox list-ticket-delete aspect-square min-w-[1rem] m-[0.25rem] flex flex-col justify-center items-center h-full w-[2rem]"
                            data-checked={selected.includes(ticket.id)}
                            onClick={() => toggleSelect(ticket.id)}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    toggleSelect(ticket.id);
                                }
                            }}
                            role="checkbox"
                            aria-checked={selected.includes(ticket.id)}
                            tabIndex={0}
                        >
                            <FontAwesomeIcon className="checkbox-icon" icon={faXmark} />
                        </div>

                        <Link className="list-ticket-inner flex-1 h-full flex flex-col justify-center" to={`/tickets/${ticket.id}`}>
                            <p className="list-ticket-id text-[0.75rem] opacity-50">{ticket.id}</p>
                            <p className="list-ticket-name font-semibold text-[2rem] leading-8">{ticket.fullName}</p>
                            <p className="list-ticket-category w-60 flex items-center" data-category={ticket.category.toLowerCase()}>{Capitalize(ticket.category)}</p>
                            <p className="list-ticket-unix text-[0.75rem] opacity-50">{formatTime(new Date(ticket.createTime).getTime(), now, 1, 4)} ago</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default TicketsPage;