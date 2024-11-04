using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Infrastructure;
using System;
using System.Threading.Tasks;

public class TestWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup>, IDisposable where TStartup : class
{
    private string _databaseName;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.UseContentRoot(AppContext.BaseDirectory);

        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            config.AddJsonFile("appsettings.Testing.json", optional: true);
            config.AddInMemoryCollection(new Dictionary<string, string>
            {
                { "Jwt:Key", "your-very-secure-key-that-is-at-least-256-bits-long" },
                { "ConnectionStrings:DefaultConnection", "Your test database connection string" },
                { "SomeFeature:Enabled", "false" }
            });
        });

        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DDDSample1DbContext));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Generate a unique database name for each test run
            _databaseName = Guid.NewGuid().ToString();

            // Add an in-memory database for testing
            services.AddDbContext<DDDSample1DbContext>(options =>
            {
                options.UseInMemoryDatabase(_databaseName);
            });

            // Add the real mail service
            services.AddScoped<IMailService, MailService>();

            // Build the service provider
            var serviceProvider = services.BuildServiceProvider();

            // Ensure the database is created
            try
            {
                using (var scope = serviceProvider.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<DDDSample1DbContext>();

                    db.Database.EnsureCreated();
                }
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                throw new Exception("An error occurred while creating the test database.", ex);
            }
        });
    }

    public void ResetDatabase()
    {
        using (var scope = Services.CreateScope())
        {
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<DDDSample1DbContext>();

            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
        }
    }
}