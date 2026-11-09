param keyVaultName string
param webAppIdentityPrincipalId string
param storageAccountName string

resource keyVault 'Microsoft.KeyVault/vaults@2026-05-15' existing = {
  name: keyVaultName
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2026-09-01' existing = {
  name: storageAccountName
}

resource storageConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2026-05-15' = {
  parent: keyVault
  name: 'storage-connection-string'
  properties: {
    value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
  }
}

resource accessPolicies 'Microsoft.KeyVault/vaults/accessPolicies@2026-05-15' = {
  parent: keyVault
  name: 'add'
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: webAppIdentityPrincipalId
        permissions: {
          keys: []
          secrets: ['get']
          certificates: []
        }
      }
    ]
  }
}
