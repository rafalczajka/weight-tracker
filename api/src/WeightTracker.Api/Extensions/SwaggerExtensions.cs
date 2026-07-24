using FastEndpoints.Swagger;
using Microsoft.Extensions.Configuration;
using NSwag;
using NSwag.Generation.AspNetCore;
using WeightTracker.Api.Auth.ApiKey;

using ApiKeyDefaults = AspNetCore.Authentication.ApiKey.ApiKeyDefaults;

namespace WeightTracker.Api.Extensions;

internal static class SwaggerExtensions
{
    public static void AddApiKeyAuth(
        this AspNetCoreOpenApiDocumentGeneratorSettings settings,
        IConfiguration configuration)
    {
        var apiKeyHeaderName = configuration
            .GetSection(ApiKeyOptions.SectionName)
            .GetApiKeyHeaderName();

        settings.AddAuth(ApiKeyDefaults.AuthenticationScheme, new OpenApiSecurityScheme
        {
            Type = OpenApiSecuritySchemeType.ApiKey,
            Name = apiKeyHeaderName,
            In = OpenApiSecurityApiKeyLocation.Header,
            Description = "Enter an API key to authorize the requests."
        });
    }
}
