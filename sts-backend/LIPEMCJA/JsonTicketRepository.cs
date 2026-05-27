namespace LIPEMCJA;

using System.Text.Json;

public class JsonTicketRepository : ITicketRepository {
    private readonly string _filePath = "tickets.json";

    public async Task AddAsync(ServiceTicket ticket) {
        var tickets = await GetAllAsync();

        tickets.Add(ticket);

        var json = JsonSerializer.Serialize(
            tickets,
            new JsonSerializerOptions {
                WriteIndented = true
            });

        await File.WriteAllTextAsync(_filePath, json);
    }

    public async Task<List<ServiceTicket>> GetAllAsync() {
        if (!File.Exists(_filePath))
            return new List<ServiceTicket>();

        var json = await File.ReadAllTextAsync(_filePath);

        return JsonSerializer.Deserialize<List<ServiceTicket>>(json)
               ?? new List<ServiceTicket>();
    }

    public async Task<bool> UpdateAsync(ServiceTicket ticket) {
        var tickets = await GetAllAsync();
        var existingTicket = tickets.FirstOrDefault(t => t.Id == ticket.Id);

        if (existingTicket == null)
            return false;

        existingTicket.FullName = ticket.FullName;
        existingTicket.Email = ticket.Email;
        existingTicket.Description = ticket.Description;
        existingTicket.Category = ticket.Category;

        var json = JsonSerializer.Serialize(
            tickets,
            new JsonSerializerOptions {
                WriteIndented = true
            });

        await File.WriteAllTextAsync(_filePath, json);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id) {
        var tickets = await GetAllAsync();
        var ticketToRemove = tickets.FirstOrDefault(t => t.Id == id);

        if (ticketToRemove == null)
            return false;

        tickets.Remove(ticketToRemove);

        var json = JsonSerializer.Serialize(
            tickets,
            new JsonSerializerOptions {
                WriteIndented = true
            });

        await File.WriteAllTextAsync(_filePath, json);
        return true;
    }
}