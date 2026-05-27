namespace LIPEMCJA;

public class TicketLogger
{
    public void Log(ServiceTicket ticket)
    {
        Console.WriteLine($"Added ticket with id {ticket.Id}");
    }
}