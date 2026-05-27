using System.ComponentModel.DataAnnotations;

namespace LIPEMCJA;

public class ServiceTicketValidator
{
    public bool Validate(ServiceTicket ticket, out List<ValidationResult> results)
    {
        var context = new ValidationContext(ticket);

        results = new List<ValidationResult>();

        return Validator.TryValidateObject(ticket, context, results, true);
    } 
}