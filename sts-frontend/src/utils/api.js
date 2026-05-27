const API_PORT = "5008";
export const BASE_URL = `http://localhost:${API_PORT}/api/tickets`;

export async function getTickets() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function getTicketById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Failed to load ticket details");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function createTicket(ticketData) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticketData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function updateTicket(id, ticketData) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticketData)
        });
        if (!response.ok) {
            throw new Error("Failed to update ticket");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function deleteTicket(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Failed to delete ticket");
        }
        return true;
    } catch (error) {
        throw error;
    }
}