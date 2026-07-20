using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WeightTracker.Api;
using WeightTracker.Api.Auth;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;
using WeightTracker.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSmartAuthentication(builder.Configuration);

builder.Services.AddCustomOutputCache();
builder.Services.AddFastEndpoints();

builder.Services.SwaggerDocument(options =>
{
    options.AutoTagPathSegmentIndex = 2;
    options.ShortSchemaNames = true;
    options.DocumentSettings = settings =>
    {
        settings.Title = "Weight Tracker";
        settings.AddApiKeyAuth(builder.Configuration);
        settings.SchemaSettings.SchemaProcessors.Add(new RequiredNonNullableSchemaProcessor());
    };
});

builder.Services.AddScoped<CurrentUser>();
builder.Services.AddData(builder.Configuration);

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.UseOutputCache();
app.UseFastEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerGen();
}

app.Run();
