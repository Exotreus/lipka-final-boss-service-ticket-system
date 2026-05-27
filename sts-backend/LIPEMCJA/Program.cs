using LIPEMCJA;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReact",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .WithOrigins("http://localhost:5173");
        });
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "LIPEMCJA API",
            Version = "v1"
        }
    );
});

builder.Services.AddSingleton<ITicketRepository, JsonTicketRepository>();
builder.Services.AddSingleton<TicketService>();
builder.Services.AddSingleton<ServiceTicketValidator>();

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "LIPEMCJA API V1"
    );
});

app.UseCors("AllowReact");

app.UseHttpsRedirection();

app.MapControllers();

var service = app.Services.GetRequiredService<TicketService>();

var logger = new TicketLogger();
var notifier = new EmailNotifier();

service.TicketAdded += logger.Log;
service.TicketAdded += notifier.Send;

app.Run();

public partial class Program { }