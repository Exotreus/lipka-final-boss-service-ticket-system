import React, { useState } from 'react';
import '../styles/pages/NewTicketPage.css';
import { createTicket } from '../utils/api';

function NewTicketPage() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        category: 'Misc',
        description: ''
    });

    const [status, setStatus] = useState({
        text: '-',
        ok: false
    });

    function handleChange(e) {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    function validateForm() {
        const fullName = form.fullName.trim();
        const email = form.email.trim();
        const description = form.description.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (fullName.length < 2) {
            return {
                text: 'Name must be at least 2 characters',
                ok: false
            };
        }

        if (!email || !emailRegex.test(email)) {
            return {
                text: 'Email not provided or incorrect',
                ok: false
            };
        }

        if (description.length < 10) {
            return {
                text: 'Description must be at least 10 characters',
                ok: false
            };
        }

        return {
            text: 'OK',
            ok: true
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const validation = validateForm();

        if (!validation.ok) {
            setStatus(validation);
            return;
        }

        try {
            await createTicket(form);
            setStatus({
                text: 'Ticket added successfully',
                ok: true
            });
            setForm({
                fullName: '',
                email: '',
                category: 'Misc',
                description: ''
            });
        } catch (error) {
            setStatus({
                text: 'Error while adding ticket to backend server',
                ok: false
            });
        }
    }

    return (
        <section id="page-newticket">
            <h1 className="text-[10rem] font-bold">New Ticket</h1>

            <form className="form-create flex flex-col justify-center items-center gap-[0.5rem]" onSubmit={handleSubmit}>
                <label className="form-create-field flex justify-center items-center gap-[0.5rem] bg-transparent">
                    <p className="form-create-field-label opacity-[75%] text-[0.75rem]">Name</p>
                    <input className="text-center border-none outline-none bg-transparent" type="text" name="fullName" value={form.fullName} onChange={handleChange} required/>
                </label>

                <label className="form-create-field flex justify-center items-center gap-[0.5rem] bg-transparent">
                    <p className="form-create-field-label opacity-[75%] text-[0.75rem]">Email</p>
                    <input className="text-center border-none outline-none bg-transparent" type="email" name="email" value={form.email} onChange={handleChange} required/>
                </label>

                <label className="form-create-field flex justify-center items-center gap-[0.5rem] bg-transparent">
                    <p className="form-create-field-label opacity-[75%] text-[0.75rem]">Category</p>
                    <select name="category" value={form.category} onChange={handleChange}>
                        <option value="Misc">Misc</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Network">Network</option>
                    </select>
                </label>

                <label className="form-create-field flex justify-center items-center gap-[0.5rem] bg-transparent">
                    <p className="form-create-field-label opacity-[75%] text-[0.75rem]">Description</p>
                    <textarea className="text-left border-none bg-transparent resize-none text-[1rem] leading-[1.5] min-h-[10rem]" name="description" value={form.description} onChange={handleChange} required/>
                </label>

                <button type="submit">
                    <p className="button-text">Submit</p>
                </button>
            </form>

            <p id="status-message" data-ok={status.ok} style={{ opacity: status.text === '-' ? 0 : 1 }}>
                {status.text}
            </p> 
        </section>
    );
}

export default NewTicketPage;