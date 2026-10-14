Add-Type -AssemblyName System.Drawing

function Convert-To916 {
    param (
        [string]$SourcePath,
        [string]$TargetPath,
        [int]$TargetWidth,
        [int]$TargetHeight,
        [string]$BgHex = "#0a0a0d"
    )

    if (!(Test-Path $SourcePath)) {
        Write-Error "Source file not found: $SourcePath"
        return
    }

    $src = [System.Drawing.Image]::FromFile($SourcePath)
    $dest = New-Object System.Drawing.Bitmap($TargetWidth, $TargetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($dest)

    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $bgColor = [System.Drawing.ColorTranslator]::FromHtml($BgHex)
    $graphics.Clear($bgColor)

    $srcRatio = $src.Width / $src.Height
    $targetRatio = $TargetWidth / $TargetHeight

    $drawWidth = $TargetWidth
    $drawHeight = $TargetHeight
    $x = 0
    $y = 0

    if ($srcRatio -gt $targetRatio) {
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
    Write-Output "Created: $TargetPath ($TargetWidth x $TargetHeight)"
}

$assetsDir = "c:\Users\filip\AntigravityProjects\family-calc\google-play\assets"

$screenshots = @(
    @{ Name = "screenshot_1_calculator"; Raw = "screenshot_1_calculator_raw_1080x2400.png" },
    @{ Name = "screenshot_2_tree";       Raw = "screenshot_2_tree_raw_1080x2400.png" },
    @{ Name = "screenshot_3_languages";  Raw = "screenshot_3_languages_raw_1080x2400.png" },
    @{ Name = "screenshot_4_gedcom";     Raw = "screenshot_4_gedcom_raw_1080x2400.png" },
    @{ Name = "screenshot_5_quiz";       Raw = "screenshot_5_quiz_raw_1080x2400.png" },
    @{ Name = "screenshot_6_settings";   Raw = "screenshot_6_settings_raw_1080x2400.png" }
)

foreach ($s in $screenshots) {
    $src = Join-Path $assetsDir $s.Raw
    
    # 1. 1080x1920 (Standard 9:16)
    $out1080 = Join-Path $assetsDir ("$($s.Name)_9_16_1080x1920.png")
    Convert-To916 -SourcePath $src -TargetPath $out1080 -TargetWidth 1080 -TargetHeight 1920
    
    # 2. 1350x2400 (High-res 9:16)
    $out1350 = Join-Path $assetsDir ("$($s.Name)_9_16_1350x2400.png")
    Convert-To916 -SourcePath $src -TargetPath $out1350 -TargetWidth 1350 -TargetHeight 2400

    # 3. Default store upload target (1080x1920)
    $outDefault = Join-Path $assetsDir ("$($s.Name).png")
    Copy-Item -Force $out1080 $outDefault
}

Write-Output "All 6 screenshots processed to 9:16 successfully!"
