# Builds the Android app. The project is copied to a short path first, because
# Windows path limits break Gradle in deeply nested folders.
#   .\build.ps1            -> debug APK (for trying on a phone)
#   .\build.ps1 bundleRelease / assembleRelease once a signing key is set up
param([string]$Task = "assembleDebug")
$ErrorActionPreference = "Stop"
$T = "$env:USERPROFILE\.elgato-android"
$env:JAVA_HOME = "$T\jdk"
$env:ANDROID_HOME = "$T\sdk"
$env:ANDROID_SDK_ROOT = "$T\sdk"
$here = $PSScriptRoot
robocopy $here "$T\proj" /MIR /XD .gradle build /NFL /NDL /NJH /NJS /NP | Out-Null
robocopy "$here\..\elgatoloco" "$T\web" /MIR /XD tools /NFL /NDL /NJH /NJS /NP | Out-Null
& "$T\gradle-8.9\bin\gradle.bat" -p "$T\proj" "-PwebDir=$T\web" --console=plain -q $Task
if ($LASTEXITCODE -ne 0) { throw "Gradle failed" }
Get-ChildItem "$T\proj\app\build\outputs" -Recurse -Include *.apk, *.aab | ForEach-Object { $_.FullName }
