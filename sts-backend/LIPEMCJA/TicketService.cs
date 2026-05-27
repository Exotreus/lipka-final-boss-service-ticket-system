namespace LIPEMCJA;

public class TicketService {
    private readonly ITicketRepository _repository;

    public event TicketAddedHandler? TicketAdded;

    public TicketService(ITicketRepository repository) {
        _repository = repository;
    }

    public async Task AddTicketAsync(ServiceTicket ticket) {
        await _repository.AddAsync(ticket);

        TicketAdded?.Invoke(ticket);
    }

    public async Task<List<ServiceTicket>> GetTicketsAsync() {
        return await _repository.GetAllAsync();
    }

    public async Task<bool> UpdateTicketAsync(ServiceTicket ticket) {
        return await _repository.UpdateAsync(ticket);
    }

    public async Task<bool> DeleteTicketAsync(Guid id) {
        return await _repository.DeleteAsync(id);
    }
}