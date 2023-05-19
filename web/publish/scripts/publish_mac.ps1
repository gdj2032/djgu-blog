

$webExist=Test-Path -Path .\dist
if ($webExist -eq $false)
{
  Write-Error -Message "Web has not been build, please run 'npm run build-web' first"
  exit 1
}

$releaseDir="./pc_release"
$assetDir="$releaseDir/release"
$outDir="$releaseDir/output"
Remove-Item $releaseDir -Recurse -ErrorAction Ignore
mkdir $assetDir

#build node code
npm run build-ele

#copy web to src
# cp -r ./dist $assetDir

# build x64
# .\\publish\\scripts\\checkEnv.ps1 x64
npm run packmac -- ./publish/config/dmg.json

# 会碰到上面pack的进程还锁定了文件，无法读取的情况，此处sleep一下
echo "waiting..."
Start-Sleep -s 5

# if (Get-Command "7z.exe" -ErrorAction SilentlyContinue) {
#     7z a $releaseDir\release.zip $outDir\*
# } else {
#   Compress-Archive -Path $outDir\* -CompressionLevel Fastest -DestinationPath $releaseDir\release.zip
# }
