import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/pages/TicketDetailsPage.css';
import { getTickets, updateTicket, deleteTicket } from '../utils/api';
import { Capitalize, formatTime } from '../utils/misc';

function TicketDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [now, setNow] = useState(Date.now());
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        category: 'Misc',
        description: '',
    });

    async function loadTicketData() {
        try {
            const allTickets = await getTickets();
            const foundTicket = allTickets.find(t => t.id === id);
            if (!foundTicket) {
                setError("Ticket not found.");
                return;
            }
            setTicket(foundTicket);
            setForm({
                fullName: foundTicket.fullName,
                email: foundTicket.email,
                category: foundTicket.category,
                description: foundTicket.description,
            });
        } catch (err) {
            setError("Failed to download requested details.");
        }
    }

    useEffect(() => {
        loadTicketData();
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 500);
        return () => clearInterval(interval);
    }, [id]);

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSave() {
        try {
            if (form.description.length < 10) {
                setError("Description must be at least 10 characters long.");
                return;
            }
            await updateTicket(id, {
                fullName: form.fullName,
                email: form.email,
                category: form.category,
                description: form.description
            });
            setIsEditing(false);
            setError("");
            await loadTicketData();
        } catch (err) {
            setError("Could not commit updates to the server.");
        }
    }

    async function handleDelete() {
        try {
            await deleteTicket(id);
            navigate('/tickets');
        } catch (err) {
            setError("Failed to execute deletion on the server.");
        }
    }

    if (error) {
        return (
            <section id="page-ticketdetails">
                <h1 className="text-[10rem] font-bold">Ticket Details</h1>
                <p className="error-message">{error}</p>
                <button onClick={() => navigate('/tickets')}><p className="button-text">Back to Tickets</p></button>
            </section>
        );
    }

    if (!ticket) {
        return (
            <section id="page-ticketdetails">
                <h1 className="text-[10rem] font-bold">Loading...</h1>
            </section>
        );
    }

    return (
        <section id="page-ticketdetails">
            <h1 className="text-[10rem] font-bold">Ticket Details</h1>

            <ul className="ticket-details flex flex-col justify-center items-center gap-[1rem]">
                <li className="flex justify-center items-center gap-[0.5rem]">
                    <p className="ticket-field-label opacity-[75%] text-[0.75rem]">Name</p>
                    {isEditing ? <input className="text-center border-none outline-none bg-transparent" type="text" name="fullName" value={form.fullName} onChange={handleChange} /> : <p className="ticket-field-data text-color-main">{form.fullName}</p>}
                </li>
                <li className="flex justify-center items-center gap-[0.5rem]">
                    <p className="ticket-field-label opacity-[75%] text-[0.75rem]">Email</p>
                    {isEditing ? <input className="text-center border-none outline-none bg-transparent" type="email" name="email" value={form.email} onChange={handleChange} /> : <p className="ticket-field-data text-color-main">{form.email}</p>}
                </li>
                <li className="flex justify-center items-center gap-[0.5rem]">
                    <p className="ticket-field-label opacity-[75%] text-[0.75rem]">Category</p>
                    {isEditing
                        ? (
                            <select name="category" value={form.category} onChange={handleChange}>
                                <option value="Misc">Misc</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Network">Network</option>
                            </select>
                        )
                        : <p className="ticket-field-data text-color-main">{Capitalize(form.category)}</p>}
                </li>
                <li className="flex justify-center items-center gap-[0.5rem]">
                    <p className="ticket-field-label opacity-[75%] text-[0.75rem]">Description</p>
                    {isEditing ? <textarea className="text-left border-none bg-transparent resize-none text-[1rem] leading-[1.5] min-h-[10rem]" name="description" value={form.description} onChange={handleChange} /> : <p className="ticket-field-data text-color-main">{form.description}</p>}
                </li>
                <li className="flex justify-center items-center gap-[0.5rem]">
                    <p className="ticket-field-label opacity-[75%] text-[0.75rem]">Created</p>
                    <p className="ticket-field-data"><span className="text-color-main">{formatTime(new Date(ticket.createTime).getTime(), now, 1, 4)}</span> ago</p>
                </li>
            </ul>

            {isEditing
                ? <button onClick={handleSave}><p className="button-text">Save</p></button>
                : <button onClick={() => setIsEditing(true)}><p className="button-text">Edit</p></button>
            }

            <button onClick={handleDelete}><p className="button-text">Delete</p></button>
        </section>
    );
}

export default TicketDetailsPage;