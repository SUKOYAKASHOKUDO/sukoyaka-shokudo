$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sourceDirectory = Join-Path $projectRoot ".source-assets\legacy-site"
$publicDirectory = Join-Path $projectRoot "public\images\legacy"

New-Item -ItemType Directory -Force -Path $sourceDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $publicDirectory | Out-Null

$legacyAssets = @(
    @{
        FileName = "legacy-photo-01.jpg"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_4196a14fa2f2451bb5737d4df9399eed~mv2.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-logo-2023.png"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_67a744b49f7a4d19a3fef240d62704a2~mv2.png"
        Kind = "identity"
    },
    @{
        FileName = "legacy-photo-02.jpg"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_043c18546a4346aab624b81ee77513f8~mv2.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-photo-03.jpg"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_dae0598c417d4042ba267d1891bcf53f~mv2.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-photo-04.jpg"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_225bb14d53394553bd88101a1faf4892~mv2.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-member-01.jpg"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_c43d632a1e464da2949b6a39c9b72d3f~mv2.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-member-02.jpg"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_3defc835004d4023a94fdc93143d2e95~mv2.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-member-03.jpg"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_ec400cdb109847d68df3ae7a45a77132~mv2.jpg/v1/fill/w_1800,h_872,fp_0.50_0.51,q_90/5_8-curry-rice.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-member-04.png"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_cf7a75b2f6a540c3983e4df26cc97bdd~mv2.png"
        Kind = "photo"
    },
    @{
        FileName = "legacy-member-05.jpg"
        SourceUrl = "https://static.wixstatic.com/media/11062b_a32c4a05ca7c45a6a46a1b3faad801fa~mv2.jpg"
        Kind = "photo"
    },
    @{
        FileName = "legacy-member-06.png"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_182f08329f0b48d79a476cacace80dee~mv2.png/v1/fit/w_1600,h_1600,q_90/child-kitchen-volunteer.png"
        Kind = "photo"
    },
    @{
        FileName = "legacy-menu-plan.png"
        SourceUrl = "https://static.wixstatic.com/media/7e980d_649b2f9976c14131b9e3e8e79114d12e~mv2.png/v1/fit/w_1800,h_1800,q_90/legacy-menu-plan.png"
        Kind = "menu"
    }
)

function Save-OptimizedJpeg {
    param(
        [Parameter(Mandatory = $true)]
        [string]$SourcePath,
        [Parameter(Mandatory = $true)]
        [string]$DestinationPath,
        [int]$MaximumDimension = 2200,
        [long]$Quality = 88
    )

    $sourceImage = [System.Drawing.Image]::FromFile($SourcePath)
    try {
        $scale = [Math]::Min(
            1.0,
            $MaximumDimension / [double][Math]::Max($sourceImage.Width, $sourceImage.Height)
        )
        $targetWidth = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
        $targetHeight = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))
        $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.DrawImage($sourceImage, 0, 0, $targetWidth, $targetHeight)
            }
            finally {
                $graphics.Dispose()
            }

            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
                Where-Object { $_.MimeType -eq "image/jpeg" } |
                Select-Object -First 1
            $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                [System.Drawing.Imaging.Encoder]::Quality,
                $Quality
            )
            try {
                $bitmap.Save($DestinationPath, $jpegCodec, $encoderParameters)
            }
            finally {
                $encoderParameters.Dispose()
            }
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $sourceImage.Dispose()
    }
}

$results = foreach ($asset in $legacyAssets) {
    $sourcePath = Join-Path $sourceDirectory $asset.FileName
    $publicPath = Join-Path $publicDirectory $asset.FileName

    $needsDownload = -not (Test-Path -LiteralPath $sourcePath) -or
        (Get-Item -LiteralPath $sourcePath).Length -eq 0

    if ($needsDownload) {
        $downloaded = $false
        for ($attempt = 1; $attempt -le 2 -and -not $downloaded; $attempt++) {
            try {
                Invoke-WebRequest `
                    -Uri $asset.SourceUrl `
                    -OutFile $sourcePath `
                    -UseBasicParsing `
                    -TimeoutSec 45
                $downloaded = (Get-Item -LiteralPath $sourcePath).Length -gt 0
            }
            catch {
                if ($attempt -eq 2) {
                    throw
                }
            }
        }
    }

    if ($asset.FileName.EndsWith(".jpg")) {
        Save-OptimizedJpeg -SourcePath $sourcePath -DestinationPath $publicPath
    }
    else {
        Copy-Item -LiteralPath $sourcePath -Destination $publicPath -Force
    }

    $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
    try {
        [pscustomobject]@{
            FileName = $asset.FileName
            Kind = $asset.Kind
            Width = $sourceImage.Width
            Height = $sourceImage.Height
            SourceBytes = (Get-Item -LiteralPath $sourcePath).Length
            PublicBytes = (Get-Item -LiteralPath $publicPath).Length
            SourceUrl = $asset.SourceUrl
        }
    }
    finally {
        $sourceImage.Dispose()
    }
}

$results | Format-Table -AutoSize
