using LIPEMCJA;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace LIPEMCJA.Tests;

[TestClass]
public class ServiceTicketTests {
    [TestMethod]
    public void Should_Return_False_When_Ticket_Data_Is_Invalid() {
        var validator = new ServiceTicketValidator();

        var badTicket = new ServiceTicket {
            FullName = "H", // Too short
            Email = "broken_rmail",
            Description = "Short",
            Category = ServiceTicketCategories.Software
        };

        var isValid = validator.Validate(badTicket, out var validationResults);

        Assert.IsFalse(isValid);
        Assert.IsTrue(validationResults.Count > 0);
    }

    [TestMethod]
    public void Should_Return_True_When_Ticket_Data_Is_Valid() {
        var validator = new ServiceTicketValidator();

        var goodTicket = new ServiceTicket {
            FullName = "Tung Tung Sahur",
            Email = "tung@sahur.com",
            Description = "Tung tung tung tung tung tung tung tung sahur!!",
            Category = ServiceTicketCategories.Network
        };

        var isValid = validator.Validate(goodTicket, out var validationResults);

        Assert.IsTrue(isValid);
        Assert.AreEqual(0, validationResults.Count);
    }

    [TestMethod]
    public async Task Should_Invoke_TicketAdded_Event_When_Added_Through_Service() {
        bool eventWasRaised = false;

        var repo = new JsonTicketRepository();
        var service = new TicketService(repo);

        service.TicketAdded += (ticket) => {
            eventWasRaised = true;
        };

        var mockTicket = new ServiceTicket {
            FullName = "Test Event User",
            Email = "event@test.com",
            Description = "Are the handlers executing properly?"
        };

        await service.AddTicketAsync(mockTicket);

        Assert.IsTrue(eventWasRaised);
    }

    [TestMethod]
    public void Should_Serialize_And_Deserialize_Ticket_Correctly() {
        var ticket = new ServiceTicket {
            Id = Guid.NewGuid(),
            FullName = "Kuba Buba",
            Email = "bo.anakonda@t.o",
            Description = "Monitor breaks when I stick my sahur in!",
            Category = ServiceTicketCategories.Hardware,
            CreateTime = DateTime.UtcNow
        };

        var options = new JsonSerializerOptions();
        options.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());

        var jsonPayload = JsonSerializer.Serialize(ticket, options);
        var recoveredTicket = JsonSerializer.Deserialize<ServiceTicket>(jsonPayload, options);

        Assert.IsNotNull(recoveredTicket);
        Assert.AreEqual(ticket.Id, recoveredTicket.Id);
        Assert.AreEqual(ticket.Email, recoveredTicket.Email);
        Assert.AreEqual(ticket.Category, recoveredTicket.Category);
    }
}

[TestClass]
public class TicketsApiIntegrationTests {
    private readonly HttpClient _client;

    public TicketsApiIntegrationTests() {
        var factory = new WebApplicationFactory<Program>();
        _client = factory.CreateClient();
    }

    [TestMethod]
    public async Task Get_Tickets_Endpoint_Should_Return_Success_Status_Code() {
        var response = await _client.GetAsync("/api/tickets");

        Assert.IsTrue(response.IsSuccessStatusCode);
        Assert.AreEqual("application/json", response.Content.Headers.ContentType?.MediaType);
    }

    [TestMethod]
    public async Task Create_Valid_Ticket_Should_Return_Ok_With_New_Id() {
        var newTicket = new ServiceTicket {
            FullName = "Łukasz Dąbek",
            Email = "lukasz.dabek@lukasz.zabek",
            Description = "Klawiatura nie działa kiedy wciskam szczotką do ząbek (jak dąbek (łukasz dąbek)).",
            Category = ServiceTicketCategories.Hardware
        };

        var options = new JsonSerializerOptions { Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() } };
        var jsonContent = new StringContent(JsonSerializer.Serialize(newTicket, options), System.Text.Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/api/tickets", jsonContent);

        Assert.IsTrue(response.IsSuccessStatusCode);

        var responseString = await response.Content.ReadAsStringAsync();
        var createdTicket = JsonSerializer.Deserialize<ServiceTicket>(responseString, options);

        Assert.IsNotNull(createdTicket);
        Assert.AreNotEqual(Guid.Empty, createdTicket.Id);
    }
}