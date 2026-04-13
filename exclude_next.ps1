# Get current directory (where script is placed)
$projectPath = Get-Location

# Construct .next path
$nextPath = Join-Path $projectPath ".next"

# Check if .next folder exists
if (Test-Path $nextPath) {
    Write-Host "Found .next folder at: $nextPath"

    # Add to Windows Defender exclusion
    Add-MpPreference -ExclusionPath $nextPath

    Write-Host "✅ Successfully added to Windows Defender exclusions"
} else {
    Write-Host "❌ .next folder not found in this directory"
}