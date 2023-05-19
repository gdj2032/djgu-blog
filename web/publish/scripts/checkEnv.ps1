$1=$args[0]
echo $1 $1
echo "checking $1 electron build env"
# npm install
$packageInfo = Get-Content node_modules\electron\package.JSON | ConvertFrom-Json
$ele_version = $packageInfo.version
echo electronVersion=$ele_version
$electronDistDir=".\\publish\\electronDist"
$fileExist=Test-Path -Path $electronDistDir\$1\electron.exe -PathType Leaf
$hasFile=$false

If ($fileExist -eq $true)
{	
    $curVersion = (Get-Command $electronDistDir\$1\electron.exe).Version
    $curVerString=$curVersion.toString()
    echo "$1 exe file Exist, checking version $curVerString, $ele_version"
    if ($curVersion -eq [System.Version]"$ele_version.0")
    {
        echo "$1 exe file Exist, Version match"
        $hasFile=$true   
    }
    else
    {
        echo "$1 exe file Exist, Version not match"
    }
}

if ($hasFile -eq $false)
{
  $dstFolder="$electronDistDir\$1"
  $downloadFile="$electronDistDir\$1.zip"
   echo "$1 exe file not found , Try to downloading..."
   Remove-Item $dstFolder -Recurse -ErrorAction Ignore 
   mkdir -Force $dstFolder
   Invoke-WebRequest -Uri "https://github.com/electron/electron/releases/download/v${ele_version}/electron-v${ele_version}-win32-$1.zip" -OutFile $downloadFile
   Expand-Archive -LiteralPath $downloadFile -DestinationPath $dstFolder
   Remove-Item $downloadFile -Recurse -ErrorAction Ignore 
}
Else {
    echo "$1 Env exist"
}