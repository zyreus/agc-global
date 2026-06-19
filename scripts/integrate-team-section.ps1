# Integrates the Meet Our Team section into the AGC Global frontend.
# Run from project root: powershell -ExecutionPolicy Bypass -File scripts/integrate-team-section.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

function Update-FileContent {
    param(
        [string]$Path,
        [scriptblock]$Transform
    )

    if (-not (Test-Path $Path)) {
        throw "File not found: $Path"
    }

    $content = Get-Content $Path -Raw
    $updated = & $Transform $content

    if ($updated -eq $content) {
        Write-Host "Already up to date: $Path"
        return
    }

    try {
        Set-Content -Path $Path -Value $updated -NoNewline
        Write-Host "Updated: $Path"
    }
    catch {
        Write-Warning "Could not write $Path — apply manually using scripts/team-section.patch"
        throw
    }
}

$homePath = Join-Path $root 'frontend\src\pages\Home.jsx'
Update-FileContent $homePath {
    param($c)

    if ($c -notmatch 'TeamSection') {
        $c = $c -replace "import CareersNewsSection from '\.\./components/marketing/CareersNewsSection\.jsx'", "import CareersNewsSection from '../components/marketing/CareersNewsSection.jsx'`r`nimport TeamSection from '../components/marketing/TeamSection.jsx'"
    }

    if ($c -notmatch '<TeamSection') {
        $c = $c -replace '(      </section>\r?\n\r?\n      <section id="services")', "      </section>`r`n`r`n      <TeamSection />`r`n`r`n      <section id=`"services`""
    }

    return $c
}

$headerPath = Join-Path $root 'frontend\src\components\Header.jsx'
Update-FileContent $headerPath {
    param($c)

    if ($c -notmatch "id: 'team'") {
        $c = $c -replace "(\{ id: 'about', label: 'About' \},)", "`$1`r`n    { id: 'team', label: 'Our Team' },"
    }

    return $c
}

$footerPath = Join-Path $root 'frontend\src\components\Footer.jsx'
Update-FileContent $footerPath {
    param($c)

    if ($c -notmatch '#team') {
        $c = $c -replace "(\{ href: '#about', label: 'About' \},)", "`$1`r`n  { href: '#team', label: 'Our Team' },"
    }

    return $c
}

Write-Host ''
Write-Host 'Team section integration complete. Rebuild with: cd frontend && npm run build'
