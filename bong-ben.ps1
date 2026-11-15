function test.reaparall.returntotest.max.final {
    param([scriptblock]$Repair, [ValidateRange(0,10)][int]$MaxRepairs = 1)
    $node = Get-Command node -CommandType Application -ErrorAction Stop | Select-Object -First 1
    for ($attempt = 0; ; $attempt++) {
        & $node.Source --test (Join-Path $PSScriptRoot 'hub.test.mjs') (Join-Path $PSScriptRoot 'arcade.test.mjs') | Out-Host
        if ($LASTEXITCODE -eq 0) { return $true }
        if (!$Repair -or $attempt -ge $MaxRepairs) { return $false }
        $ErrorActionPreference = 'Stop'
        & $Repair | Out-Host
    }
}

function cover.todo.realing.buildinghose.buildingenteriare.compresor.returntorealing.max.games.on3d.finish {
    param([scriptblock]$Repair, [ValidateRange(0,10)][int]$MaxRepairs = 1,
          [string]$OutputDirectory = (Get-Location).Path)
    if (!(test.reaparall.returntotest.max.final -Repair $Repair -MaxRepairs $MaxRepairs)) {
        throw 'FINAL FAIL - Testovi kataloga nisu prošli.'
    }
    $files = 'games','hub.test.mjs','arcade.test.mjs','server.mjs','start.mjs','make-plugin.ps1','bong-ben.ps1','README.md','plugin.json' |
        ForEach-Object { Join-Path $PSScriptRoot $_ }
    $archive = Join-Path $OutputDirectory ('SPAJA-Igre-Pregled-' + [guid]::NewGuid().ToString('N').Substring(0,8) + '.zip')
    Compress-Archive -LiteralPath $files -DestinationPath $archive -ErrorAction Stop
    return (Resolve-Path -LiteralPath $archive).Path
}

function alltests.groving.testingcontrol.testinggpu.testinggrafiks.testingoptions.testingchatgpt.returntoalltests.finalstest.reproduction.makefinalgame {
    param([scriptblock]$Repair, [ValidateRange(0,10)][int]$MaxRepairs = 1,
          [string]$OutputDirectory = (Get-Location).Path)
    $output = (Resolve-Path -LiteralPath $OutputDirectory -ErrorAction Stop).Path
    $tempRoot = (Resolve-Path -LiteralPath ([IO.Path]::GetTempPath())).Path
    $qa = (New-Item -ItemType Directory -Path (Join-Path $tempRoot ('spaja-igre-' + [guid]::NewGuid().ToString('N'))) -ErrorAction Stop).FullName
    try {
        $candidate = cover.todo.realing.buildinghose.buildingenteriare.compresor.returntorealing.max.games.on3d.finish -Repair $Repair -MaxRepairs $MaxRepairs -OutputDirectory $qa
        $expanded = Join-Path $qa 'expanded'
        Expand-Archive -LiteralPath $candidate -DestinationPath $expanded -ErrorAction Stop
        $node = Get-Command node -CommandType Application -ErrorAction Stop | Select-Object -First 1
        & $node.Source --test (Join-Path $expanded 'hub.test.mjs') (Join-Path $expanded 'arcade.test.mjs') | Out-Host
        if ($LASTEXITCODE -ne 0) { throw 'FINAL FAIL - Raspakovani katalog nije prošao testove.' }
        $archive = Join-Path $output (Split-Path -Leaf $candidate)
        Move-Item -LiteralPath $candidate -Destination $archive -ErrorAction Stop
        Write-Output "FINAL LOCAL PASS - $archive"
        Write-Host 'GPU i stvarni ChatGPT razgovor - neprovereno.'
    } finally {
        $resolved = (Resolve-Path -LiteralPath $qa -ErrorAction Stop).Path
        if ((Split-Path -Parent $resolved).TrimEnd([IO.Path]::DirectorySeparatorChar) -eq $tempRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) -and
            (Split-Path -Leaf $resolved) -match '^spaja-igre-[0-9a-f]{32}$') {
            Remove-Item -LiteralPath $resolved -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

function reaperall.returntoreaperall.makesolutiontoworkonchatgpt.returntoreaperall.goplaygame {
    param([scriptblock]$Repair, [ValidateRange(0,10)][int]$MaxRepairs = 1,
          [string]$OutputDirectory = (Get-Location).Path, [switch]$NoLaunch)
    alltests.groving.testingcontrol.testinggpu.testinggrafiks.testingoptions.testingchatgpt.returntoalltests.finalstest.reproduction.makefinalgame -Repair $Repair -MaxRepairs $MaxRepairs -OutputDirectory $OutputDirectory
    if (!$NoLaunch) { Start-Process -FilePath (Join-Path $PSScriptRoot 'games/arkada/index.html') -ErrorAction Stop }
}


