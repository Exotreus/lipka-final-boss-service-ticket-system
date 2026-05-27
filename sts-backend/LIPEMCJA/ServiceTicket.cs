using System.ComponentModel.DataAnnotations;

namespace LIPEMCJA;

public class ServiceTicket
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MinLength(2)]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(10)]
    public string Description { get; set; } = string.Empty;

    [Required] 
    public ServiceTicketCategories Category { get; set; } = ServiceTicketCategories.Misc;
    
    public DateTime CreateTime { get; set; } = DateTime.UtcNow;
}