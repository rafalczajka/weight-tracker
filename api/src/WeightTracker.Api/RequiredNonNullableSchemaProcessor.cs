using NJsonSchema.Generation;

namespace WeightTracker.Api;

internal sealed class RequiredNonNullableSchemaProcessor : ISchemaProcessor
{
    public void Process(SchemaProcessorContext context)
    {
        var schema = context.Schema;

        if (schema.Properties.Count == 0) return;

        var schemaType = context.Settings.SchemaType;

        foreach (var property in schema.Properties.Values)
        {
            if (property.IsRequired || property.IsNullable(schemaType)) continue;
            property.IsRequired = true;
        }
    }
}
