namespace LIPEMCJA;

public interface ITicketRepository {
    Task AddAsync(ServiceTicket ticket);
    Task<List<ServiceTicket>> GetAllAsync();
    Task<bool> UpdateAsync(ServiceTicket ticket);
    Task<bool> DeleteAsync(Guid id);
}