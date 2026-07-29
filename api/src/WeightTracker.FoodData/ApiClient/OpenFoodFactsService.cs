using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using PxBunny.Result;
using WeightTracker.FoodData.Mappings;

namespace WeightTracker.FoodData.ApiClient;

internal sealed class OpenFoodFactsService(HttpClient httpClient) : IFoodService
{
    private static readonly string[] ProductFields =
    [
        "code",
        "product_name",
        "quantity",
        "serving_size",
        "serving_quantity",
        "serving_quantity_unit",
        "selected_images",
        "ingredients_text",
        "nutrition",
    ];

    private static string ProductFieldsParameter => string.Join(',', ProductFields);

    public async Task<Result<Product>> GetProductAsync(string code, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(code))
            return ResultErrors.ValidationError("Product code is required.");

        try
        {
            using var response = await httpClient.GetAsync(
                new Uri($"product/{code}?fields={ProductFieldsParameter}&lc=en", UriKind.Relative),
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);

            var responseResult = ValidateResponse(response, code);
            if (responseResult.IsFailure) return responseResult.Error!;

            var payload = await response.Content.ReadFromJsonAsync<GetProductResponse>(cancellationToken);
            return HandlePayload(payload, code);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return ResultErrors.ExternalServiceError("Open Food Facts request timed out.");
        }
        catch (HttpRequestException)
        {
            return ResultErrors.ExternalServiceError("Open Food Facts request failed.");
        }
        catch (JsonException)
        {
            return ResultErrors.ExternalServiceError("Open Food Facts returned an invalid response.");
        }
    }

    private static Result ValidateResponse(HttpResponseMessage response, string productCode)
    {
        if (response.StatusCode == HttpStatusCode.NotFound)
            return ResultErrors.NotFoundError($"Product '{productCode}' was not found.");

        else if (!response.IsSuccessStatusCode)
            return ResultErrors.ExternalServiceError("Open Food Facts returned an unsuccessful response.");

        return Result.Success();
    }

    private static Result<Product> HandlePayload(GetProductResponse? payload, string productCode)
    {
        if (payload is null)
            return ResultErrors.ExternalServiceError("Open Food Facts returned an empty response.");

        else if (!string.Equals(payload.Status, "success", StringComparison.OrdinalIgnoreCase))
            return ResultErrors.NotFoundError($"Product '{productCode}' was not found.");

        return payload.Product!.ToDomain(payload.Code ?? productCode);
    }
}
