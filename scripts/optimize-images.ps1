param(
  [int]$MaxLongEdge = 2000,
  [int]$JpegQuality = 82
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$publicImageDirectory = Join-Path $workspaceRoot "public\images"
$sourceDirectory = Join-Path $workspaceRoot ".source-assets"

foreach ($path in @($publicImageDirectory, $sourceDirectory)) {
  $fullPath = [System.IO.Path]::GetFullPath($path)
  if (-not $fullPath.StartsWith($workspaceRoot + [System.IO.Path]::DirectorySeparatorChar)) {
    throw "Workspace outside path detected: $fullPath"
  }
}

New-Item -ItemType Directory -Path $sourceDirectory -Force | Out-Null

$photos = @(
  "sukoyaka-storefront.jpg",
  "sukoyaka-banner.jpg"
)

foreach ($fileName in $photos) {
  $publicPath = Join-Path $publicImageDirectory $fileName
  $sourcePath = Join-Path $sourceDirectory $fileName

  if (-not (Test-Path -LiteralPath $sourcePath)) {
    if (-not (Test-Path -LiteralPath $publicPath)) {
      throw "Source image not found: $fileName"
    }
    Move-Item -LiteralPath $publicPath -Destination $sourcePath
  }

  $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $scale = [Math]::Min(
      1.0,
      [double]$MaxLongEdge / [double][Math]::Max($sourceImage.Width, $sourceImage.Height)
    )
    $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))

    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($sourceImage, 0, 0, $width, $height)
      }
      finally {
        $graphics.Dispose()
      }

      $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq "image/jpeg" }
      $qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality
      $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        $qualityEncoder,
        [long]$JpegQuality
      )
      try {
        $bitmap.Save($publicPath, $jpegCodec, $encoderParameters)
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

$sketchPublicPath = Join-Path $publicImageDirectory "site-sketch.jpg"
$sketchSourcePath = Join-Path $sourceDirectory "site-sketch.jpg"
if ((Test-Path -LiteralPath $sketchPublicPath) -and -not (Test-Path -LiteralPath $sketchSourcePath)) {
  Move-Item -LiteralPath $sketchPublicPath -Destination $sketchSourcePath
}

Get-ChildItem -LiteralPath $publicImageDirectory -File |
  Select-Object Name, Length |
  Format-Table -AutoSize
