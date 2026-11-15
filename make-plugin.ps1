param(
    [Parameter(Mandatory)][uri]$McpUrl,
    [string]$Destination = (Join-Path (Get-Location).Path 'SPAJA-Igre-Plugin.zip')
)
$ErrorActionPreference = 'Stop'
if (!$McpUrl.IsAbsoluteUri -or $McpUrl.Scheme -ne 'https' -or $McpUrl.UserInfo -or
    $McpUrl.Query -or $McpUrl.Fragment -or $McpUrl.IsLoopback) {
    throw 'Unesi javnu HTTPS adresu MCP servera bez pristupnih podataka ili parametara.'
}
$stage = (New-Item -ItemType Directory -Path (Join-Path ([IO.Path]::GetTempPath()) ('spaja-igre-' + [guid]::NewGuid().ToString('N')))).FullName
$plugin = Join-Path $stage 'plugin.json'
$mcp = Join-Path $stage 'mcp.json'
try {
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'plugin.json') -Destination $plugin
    [ordered]@{
        '$schema' = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json'
        mcpServers = @{ 'spaja-igre' = @{
            type = 'streamable-http'
            url = $McpUrl.AbsoluteUri
            extensions = @{ 'com.openai' = @{ auth = @{ type = 'none' } } }
        } }
    } | ConvertTo-Json -Depth 10 | Set-Content -Encoding utf8NoBOM -LiteralPath $mcp
    Compress-Archive -LiteralPath $plugin,$mcp -DestinationPath $Destination
    Write-Output $Destination
} finally {
    foreach ($item in $plugin,$mcp) {
        if (Test-Path -LiteralPath $item) { Remove-Item -LiteralPath $item }
    }
    Remove-Item -LiteralPath $stage
}


