using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Shared;
using DDDSample1.Infrastructure.Patients;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Users;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Infrastructure.OperationTypes;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Specializations;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Staffs;
using Projetos.LAPR5_3DC_G15.Mappers.Patients;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DDDSample1.Mappers.OperationTypes;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using DDDSample1.Domain.Logs;
using Projetos.LAPR5_3DC_G15.Mappers.Staffs;
using Projetos.LAPR5_3DC_G15.Mappers.Users;

namespace DDDSample1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });

            services.AddDbContext<DDDSample1DbContext>(opt =>
                opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                sqlServerOptionsAction: sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                })
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());
            ConfigureMyServices(services);

            var key = Configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("Jwt:Key", "JWT secret key cannot be null or empty.");
            }

            var keyBytes = Encoding.UTF8.GetBytes(key);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                //add session expiration time if inactivity
                x.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddSwaggerGen(options => {
                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                   Description = "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"", 
                   In = ParameterLocation.Header,
                   Name = "Authorization",
                   Type = SecuritySchemeType.ApiKey
                });

                options.OperationFilter<SecurityRequirementsOperationFilter>();
            });



            services.AddControllers().AddNewtonsoftJson();

            services.AddControllers()
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            services.AddTransient<IPatientRepository, PatientRepository>();
            services.AddTransient<IPatientMapper, PatientMapper>();
            services.AddTransient<PatientService>();

            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IUserMapper, UserMapper>();
            services.AddTransient<UserService>();

            services.AddTransient<IOperationTypeRepository, OperationTypeRepository>();
            services.AddTransient<IOperationTypeMapper, OperationTypeMapper>();
            services.AddTransient<OperationTypeService>();

            services.AddTransient<ISpecializationRepository, SpecializationRepository>();
            services.AddTransient<SpecializationService>();

            services.AddTransient<IStaffRepository, StaffRepository>();
            services.AddTransient<IStaffMapper, StaffMapper>();
            services.AddTransient<StaffService>();

            services.AddTransient<IMailService, MailService>();

            services.AddTransient<ILogRepository, LogRepository>();
        }
    }
}