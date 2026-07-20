using AspNetCore.Authentication.ApiKey;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;
using WeightTracker.Api.Auth.ApiKey;

using ApiKeyAuthOptions = WeightTracker.Api.Auth.ApiKey.ApiKeyOptions;

namespace WeightTracker.Api.Auth;

internal static class ServicesRegistration
{
    private const string SmartScheme = "Smart";

    public static IServiceCollection AddSmartAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var apiKeySection = configuration.GetSection(ApiKeyAuthOptions.SectionName);
        var apiKeyHeaderName = apiKeySection.GetValue<string>(nameof(ApiKeyAuthOptions.HeaderName));

        apiKeyHeaderName = string.IsNullOrWhiteSpace(apiKeyHeaderName)
            ? ApiKeyAuthOptions.DefaultHeaderName
            : apiKeyHeaderName;

        services.AddMicrosoftIdentityWebApiAuthentication(configuration);

        services.AddAuthentication(options =>
            {
                options.DefaultScheme = SmartScheme;
                options.DefaultChallengeScheme = SmartScheme;
            })
            .AddPolicyScheme(SmartScheme, "Smart authentication", options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    var authorization = context.Request.Headers.Authorization.ToString();
                    var hasBearer = !string.IsNullOrWhiteSpace(authorization)
                        && authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase);

                    return hasBearer
                        ? JwtBearerDefaults.AuthenticationScheme
                        : context.Request.Headers.ContainsKey(apiKeyHeaderName)
                            ? ApiKeyDefaults.AuthenticationScheme
                            : JwtBearerDefaults.AuthenticationScheme;
                };
            })
            .AddApiKeyInHeader<ConfigApiKeyProvider>(ApiKeyDefaults.AuthenticationScheme, options =>
            {
                options.Realm = "Weight Tracker";
                options.KeyName = apiKeyHeaderName;
            });

        services.AddOptions<ApiKeyAuthOptions>().Bind(apiKeySection);
        services.AddAuthorization();

        return services;
    }
}
