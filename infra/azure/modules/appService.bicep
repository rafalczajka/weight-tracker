param appName string
param appServicePlanId string
param location string
param customAppSettings array = []

resource webApp 'Microsoft.Web/sites@2025-03-01' = {
  name: appName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlanId
    httpsOnly: true
    siteConfig: {
      appSettings: customAppSettings
    }
  }
}

output identityPrincipalId string = webApp.identity.principalId
