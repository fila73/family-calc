Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param (
        [string]$SourcePath,
        [string]$TargetPath,
        [int]$TargetWidth,
        [int]$TargetHeight
    )

    $src = [System.Drawing.Image]::FromFile($SourcePath)
    $dest = New-Object System.Drawing.Bitmap($TargetWidth, $TargetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($dest)

    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Background fill #09090b
    $bgColor = [System.Drawing.ColorTranslator]::FromHtml('#09090b')
    $graphics.Clear($bgColor)

    # Scale while preserving aspect ratio or fill target
    $srcRatio = $src.Width / $src.Height
    $targetRatio = $TargetWidth / $TargetHeight

    $drawWidth = $TargetWidth
    $drawHeight = $TargetHeight
    $x = 0
    $y = 0

    if ($srcRatio -gt $targetRatio) {
        # Source is wider, fit height and crop sides or fit width
        $drawHeight = [int]($TargetWidth / $srcRatio)
        $y = [int](($TargetHeight - $drawHeight) / 2)
    } else {
        $drawWidth = [int]($TargetHeight * $srcRatio)
        $x = [int](($TargetWidth - $drawWidth) / 2)
    }

    $graphics.DrawImage($src, $x, $y, $drawWidth, $drawHeight)

    $dest.Save($TargetPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $dest.Dispose()
    $src.Dispose()
    Write-Output "Generated: $TargetPath ($TargetWidth x $TargetHeight)"
}

$artifactDir = "C:\Users\filip\.gemini\antigravity-ide\brain\5aa70219-c929-406d-98a7-a7606287b047"
$iconSrc = Join-Path $artifactDir "app_icon_512_1791747572525.jpg"
$featureSrc = Join-Path $artifactDir "feature_graphic_1791747588080.jpg"

$outDir = "c:\Users\filip\AntigravityProjects\family-calc\google-play\assets"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

Resize-Image -SourcePath $iconSrc -TargetPath (Join-Path $outDir "icon-512.png") -TargetWidth 512 -TargetHeight 512
Resize-Image -SourcePath $featureSrc -TargetPath (Join-Path $outDir "feature-graphic-1024x500.png") -TargetWidth 1024 -TargetHeight 500
