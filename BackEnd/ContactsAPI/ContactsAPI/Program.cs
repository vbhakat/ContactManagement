using System.Text.Json.Serialization;
using ContactsApi.Helpers;
using ContactsApi.Services;

var builder = WebApplication.CreateBuilder(args);

// add services to DI container
var services = builder.Services;

services.AddDbContext<DataContext>();
services.AddCors();
services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});
services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

services.AddScoped<IContactService, ContactService>();


var app = builder.Build();

// configure HTTP request pipeline
{
    // global cors policy
    app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    // global error handler
    app.UseMiddleware<ErrorHandlerMiddleware>();

    app.MapControllers();
}
// Adding this SeedDefaultData to initialize the application with In Memory value (10 entries)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    InMemoryDatabaseFactory.SeedDefaultData(context);
}
app.Run("http://localhost:4000");