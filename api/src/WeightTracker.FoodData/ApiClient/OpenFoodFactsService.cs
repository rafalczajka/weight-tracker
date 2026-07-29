using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using WeightTracker.Core.Food;
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

    public async Task<Product?> GetProductAsync(string code, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        using var response = await httpClient.GetAsync(
            new Uri($"product/{code}?fields={ProductFieldsParameter}&lc=en", UriKind.Relative),
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound) return null;

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<GetProductResponse>(cancellationToken)
            ?? throw new InvalidDataException("Open Food Facts returned an empty response.");

        return string.Equals(payload.Status, "success", StringComparison.OrdinalIgnoreCase)
            && payload.Product is { } product
                ? product.ToDomain(payload.Code ?? code)
                : null;
    }
}
