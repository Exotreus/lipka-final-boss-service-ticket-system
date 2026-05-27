namespace LIPEMCJA;

public class EmailNotifier
{
    public void Send(ServiceTicket ticket)
    {
        Console.WriteLine($"Confirmation message sent to {ticket.Email}");
    }
}