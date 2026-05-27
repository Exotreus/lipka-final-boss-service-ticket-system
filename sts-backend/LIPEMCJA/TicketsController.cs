namespace LIPEMCJA;

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase {
    private readonly TicketService _ticketService;
    private readonly ServiceTicketValidator _validator;

    public TicketsController(
        TicketService ticketService,
        ServiceTicketValidator validator) {
        _ticketService = ticketService;
        _validator = validator;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) {
        try {
            var tickets = await _ticketService.GetTicketsAsync();
            var ticket = tickets.FirstOrDefault(t => t.Id == id);
            if (ticket == null) return NotFound();
            return Ok(ticket);
        } catch (Exception ex) {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> Get() {
        try {
            var tickets = await _ticketService.GetTicketsAsync();

            return Ok(tickets);
        } catch (Exception ex) {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(ServiceTicket ticket) {
        try {
            if (!_validator.Validate(ticket, out var errors)) {
                return BadRequest(errors);
            }

            var newTicket = new ServiceTicket {
                Id = Guid.NewGuid(),
                FullName = ticket.FullName,
                Email = ticket.Email,
                Description = ticket.Description,
                Category = ticket.Category,
                CreateTime = DateTime.UtcNow
            };

            await _ticketService.AddTicketAsync(newTicket);

            return Ok(newTicket);
        } catch (Exception ex) {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, ServiceTicket ticket) {
        try {
            ticket.Id = id;
            if (!_validator.Validate(ticket, out var errors)) {
                return BadRequest(errors);
            }

            var updated = await _ticketService.UpdateTicketAsync(ticket);
            if (!updated) {
                return NotFound();
            }

            return Ok(ticket);
        } catch (Exception ex) {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) {
        try {
            var deleted = await _ticketService.DeleteTicketAsync(id);
            if (!deleted) {
                return NotFound();
            }

            return NoContent();
        } catch (Exception ex) {
            return StatusCode(500, ex.Message);
        }
    }
}