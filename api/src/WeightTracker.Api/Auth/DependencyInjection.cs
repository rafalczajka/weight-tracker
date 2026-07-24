using AspNetCore.Authentication.ApiKey;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using WeightTracker.Api.Auth.ApiKey;

using ApiKeyAuthOptions = WeightTracker.Api.Auth.ApiKey.ApiKeyOptions;

namespace WeightTracker.Api.Auth;

internal static class DependencyInjection
{
    public static IServiceCollection AddApiAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var apiKeySection = configuration.GetSection(ApiKeyAuthOptions.SectionName);
        var apiKeyHeaderName = apiKeySection.GetApiKeyHeaderName();

        var authentication = services.AddAuthentication(AuthDefaults.AuthenticationScheme);

        authentication.AddPolicyScheme(
            AuthDefaults.AuthenticationScheme,
            "Bearer or API key",
            options => options.ForwardDefaultSelector =
                context => SelectAuthenticationScheme(context, apiKeyHeaderName));

        authentication.AddMicrosoftIdentityWebApi(configuration);

        authentication.AddApiKeyInHeader<ApiKeyProvider>(ApiKeyDefaults.AuthenticationScheme, options =>
        {
            options.Realm = "Weight Tracker";
            options.KeyName = apiKeyHeaderName;
        });

        services.AddAuthorizationBuilder()
            .SetDefaultPolicy(new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireScope(AuthDefaults.RequiredScope)
                .Build());

        services.AddSingleton<IValidateOptions<ApiKeyAuthOptions>, ApiKeyOptionsValidator>();
        services.AddOptions<ApiKeyAuthOptions>().Bind(apiKeySection).ValidateOnStart();

        return services;
    }

    private static string SelectAuthenticationScheme(HttpContext context, string apiKeyHeaderName)
    {
        var authorization = context.Request.Headers.Authorization.ToString();
        var useApiKey = !authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            && context.Request.Headers.ContainsKey(apiKeyHeaderName);

        return useApiKey
            ? ApiKeyDefaults.AuthenticationScheme
            : JwtBearerDefaults.AuthenticationScheme;
    }
}
