using ControleGastos.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// 1. Configuração do Entity Framework Core (SQLite)
// A string de conexão será buscada do arquivo appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
                      ?? "Data Source=transacoes.db"));

// 2. Configuração dos Controllers e tratamento de JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Evita loops infinitos na serialização (ex: Person -> Transaction -> Person...)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 3. Configuração do CORS (Cross-Origin Resource Sharing)
// Permite que o front-end (React/Vite) faça requisições para esta API
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontendReact", policy =>
    {
        policy.WithOrigins("http://localhost:8080")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Aplica a política de CORS que criamos acima
app.UseCors("PermitirFrontendReact");

app.UseAuthorization();

app.MapControllers();

// 5. Execução automática das Migrations (Opcional, mas útil para o teste)
// Isso garante que o banco 'gastos.db' e as tabelas sejam criados automaticamente ao iniciar a API, 
// desde que você já tenha rodado o 'dotnet ef migrations add Inicial' antes.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao aplicar as migrations do banco de dados.");
    }
}

app.Run();