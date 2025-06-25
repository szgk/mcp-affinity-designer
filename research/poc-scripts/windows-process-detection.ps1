# Affinity Designer Process Detection and Management
# Affinity Designerプロセス検出と管理
#
# This PowerShell script provides proof-of-concept automation for detecting
# and managing Affinity Designer processes on Windows.
# このPowerShellスクリプトは、WindowsでAffinity Designerプロセスを検出・管理する
# 概念実証自動化を提供します。

param(
    [string]$Action = "detect",
    [string]$DocumentPath = ""
)

# Configuration / 設定
$AffinityProcessNames = @(
    "Affinity Designer*",
    "AffinityDesigner*", 
    "Designer*"
)

$AffinityInstallPaths = @(
    "${env:ProgramFiles}\Affinity\Affinity Designer 2\Affinity Designer 2.exe",
    "${env:ProgramFiles(x86)}\Affinity\Affinity Designer 2\Affinity Designer 2.exe",
    "${env:ProgramFiles}\Affinity\Affinity Designer\Affinity Designer.exe"
)

# Function: Detect Affinity Designer processes
# 関数: Affinity Designerプロセスを検出
function Get-AffinityDesignerProcesses {
    Write-Host "Detecting Affinity Designer processes..." -ForegroundColor Green
    Write-Host "Affinity Designerプロセスを検出中..." -ForegroundColor Green
    
    $processes = @()
    
    foreach ($processName in $AffinityProcessNames) {
        try {
            $found = Get-Process -Name $processName -ErrorAction SilentlyContinue
            if ($found) {
                $processes += $found
                Write-Host "Found process: $($found.ProcessName) (PID: $($found.Id))" -ForegroundColor Yellow
                Write-Host "プロセス発見: $($found.ProcessName) (PID: $($found.Id))" -ForegroundColor Yellow
            }
        }
        catch {
            # Process not found, continue / プロセスが見つからない、続行
        }
    }
    
    if ($processes.Count -eq 0) {
        Write-Host "No Affinity Designer processes found" -ForegroundColor Red
        Write-Host "Affinity Designerプロセスが見つかりません" -ForegroundColor Red
    }
    
    return $processes
}

# Function: Get Affinity Designer installation path
# 関数: Affinity Designerインストールパスを取得
function Get-AffinityDesignerPath {
    Write-Host "Searching for Affinity Designer installation..." -ForegroundColor Green
    Write-Host "Affinity Designerインストールを検索中..." -ForegroundColor Green
    
    foreach ($path in $AffinityInstallPaths) {
        if (Test-Path $path) {
            Write-Host "Found installation: $path" -ForegroundColor Yellow
            Write-Host "インストール発見: $path" -ForegroundColor Yellow
            return $path
        }
    }
    
    Write-Host "Affinity Designer installation not found in standard locations" -ForegroundColor Red
    Write-Host "標準的な場所でAffinity Designerインストールが見つかりません" -ForegroundColor Red
    return $null
}

# Function: Start Affinity Designer
# 関数: Affinity Designerを開始
function Start-AffinityDesigner {
    param([string]$DocumentPath = "")
    
    $affinityPath = Get-AffinityDesignerPath
    if (-not $affinityPath) {
        throw "Cannot start Affinity Designer: Installation not found"
        throw "Affinity Designerを開始できません: インストールが見つかりません"
    }
    
    Write-Host "Starting Affinity Designer..." -ForegroundColor Green
    Write-Host "Affinity Designerを開始中..." -ForegroundColor Green
    
    try {
        if ($DocumentPath -and (Test-Path $DocumentPath)) {
            # Start with document / ドキュメントと共に開始
            $process = Start-Process -FilePath $affinityPath -ArgumentList "`"$DocumentPath`"" -PassThru
            Write-Host "Started with document: $DocumentPath" -ForegroundColor Yellow
            Write-Host "ドキュメントと共に開始: $DocumentPath" -ForegroundColor Yellow
        } else {
            # Start without document / ドキュメントなしで開始
            $process = Start-Process -FilePath $affinityPath -PassThru
            Write-Host "Started without document" -ForegroundColor Yellow
            Write-Host "ドキュメントなしで開始" -ForegroundColor Yellow
        }
        
        # Wait for process to initialize / プロセス初期化を待機
        Start-Sleep -Seconds 3
        
        return $process
    }
    catch {
        Write-Error "Failed to start Affinity Designer: $($_.Exception.Message)"
        Write-Error "Affinity Designerの開始に失敗: $($_.Exception.Message)"
        return $null
    }
}

# Function: Get window information
# 関数: ウィンドウ情報を取得
function Get-AffinityDesignerWindows {
    $processes = Get-AffinityDesignerProcesses
    $windows = @()
    
    foreach ($process in $processes) {
        if ($process.MainWindowTitle) {
            $windowInfo = [PSCustomObject]@{
                ProcessId = $process.Id
                ProcessName = $process.ProcessName
                WindowTitle = $process.MainWindowTitle
                WindowHandle = $process.MainWindowHandle
                StartTime = $process.StartTime
            }
            $windows += $windowInfo
            
            Write-Host "Window: '$($windowInfo.WindowTitle)' (PID: $($windowInfo.ProcessId))" -ForegroundColor Cyan
            Write-Host "ウィンドウ: '$($windowInfo.WindowTitle)' (PID: $($windowInfo.ProcessId))" -ForegroundColor Cyan
        }
    }
    
    return $windows
}

# Function: Monitor process status
# 関数: プロセス状態を監視
function Monitor-AffinityDesigner {
    param([int]$DurationSeconds = 30)
    
    Write-Host "Monitoring Affinity Designer for $DurationSeconds seconds..." -ForegroundColor Green
    Write-Host "Affinity Designerを${DurationSeconds}秒間監視中..." -ForegroundColor Green
    
    $startTime = Get-Date
    
    while ((Get-Date) -lt $startTime.AddSeconds($DurationSeconds)) {
        $processes = Get-AffinityDesignerProcesses
        
        if ($processes.Count -gt 0) {
            Write-Host "$(Get-Date -Format 'HH:mm:ss') - Active processes: $($processes.Count)" -ForegroundColor Yellow
            Write-Host "$(Get-Date -Format 'HH:mm:ss') - アクティブプロセス: $($processes.Count)" -ForegroundColor Yellow
        } else {
            Write-Host "$(Get-Date -Format 'HH:mm:ss') - No processes detected" -ForegroundColor Gray
            Write-Host "$(Get-Date -Format 'HH:mm:ss') - プロセス検出されず" -ForegroundColor Gray
        }
        
        Start-Sleep -Seconds 5
    }
}

# Function: Test file operations
# 関数: ファイル操作をテスト
function Test-FileOperations {
    Write-Host "Testing file operation capabilities..." -ForegroundColor Green
    Write-Host "ファイル操作機能をテスト中..." -ForegroundColor Green
    
    # Check for common Affinity Designer file types
    # 一般的なAffinity Designerファイルタイプをチェック
    $testPaths = @(
        "$env:USERPROFILE\Documents\*.afdesign",
        "$env:USERPROFILE\Desktop\*.afdesign",
        "$env:USERPROFILE\Downloads\*.afdesign"
    )
    
    $foundFiles = @()
    foreach ($path in $testPaths) {
        $files = Get-ChildItem -Path $path -ErrorAction SilentlyContinue
        if ($files) {
            $foundFiles += $files
        }
    }
    
    if ($foundFiles.Count -gt 0) {
        Write-Host "Found Affinity Designer files:" -ForegroundColor Yellow
        Write-Host "Affinity Designerファイルが見つかりました:" -ForegroundColor Yellow
        foreach ($file in $foundFiles | Select-Object -First 5) {
            Write-Host "  - $($file.FullName)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "No Affinity Designer files found in common locations" -ForegroundColor Gray
        Write-Host "一般的な場所でAffinity Designerファイルが見つかりません" -ForegroundColor Gray
    }
    
    return $foundFiles
}

# Main execution logic / メイン実行ロジック
try {
    Write-Host "=== Affinity Designer Automation POC ===" -ForegroundColor Magenta
    Write-Host "=== Affinity Designer自動化概念実証 ===" -ForegroundColor Magenta
    Write-Host ""
    
    switch ($Action.ToLower()) {
        "detect" {
            Write-Host "Action: Process Detection / アクション: プロセス検出" -ForegroundColor Blue
            $processes = Get-AffinityDesignerProcesses
            $windows = Get-AffinityDesignerWindows
            
            Write-Host ""
            Write-Host "Summary / 概要:" -ForegroundColor Green
            Write-Host "  Processes found: $($processes.Count) / プロセス発見: $($processes.Count)"
            Write-Host "  Windows found: $($windows.Count) / ウィンドウ発見: $($windows.Count)"
        }
        
        "start" {
            Write-Host "Action: Start Application / アクション: アプリケーション開始" -ForegroundColor Blue
            $process = Start-AffinityDesigner -DocumentPath $DocumentPath
            if ($process) {
                Write-Host "Successfully started Affinity Designer (PID: $($process.Id))" -ForegroundColor Green
                Write-Host "Affinity Designerの開始に成功 (PID: $($process.Id))" -ForegroundColor Green
            }
        }
        
        "monitor" {
            Write-Host "Action: Monitor Processes / アクション: プロセス監視" -ForegroundColor Blue
            Monitor-AffinityDesigner -DurationSeconds 30
        }
        
        "files" {
            Write-Host "Action: File Discovery / アクション: ファイル発見" -ForegroundColor Blue
            $files = Test-FileOperations
            Write-Host "Found $($files.Count) Affinity Designer files / $($files.Count)個のAffinity Designerファイルを発見"
        }
        
        "full" {
            Write-Host "Action: Full Test Suite / アクション: 完全テストスイート" -ForegroundColor Blue
            
            Write-Host "`n1. Installation Detection / インストール検出:" -ForegroundColor Yellow
            Get-AffinityDesignerPath | Out-Null
            
            Write-Host "`n2. Process Detection / プロセス検出:" -ForegroundColor Yellow
            $processes = Get-AffinityDesignerProcesses
            
            Write-Host "`n3. Window Information / ウィンドウ情報:" -ForegroundColor Yellow
            Get-AffinityDesignerWindows | Out-Null
            
            Write-Host "`n4. File Discovery / ファイル発見:" -ForegroundColor Yellow
            Test-FileOperations | Out-Null
            
            Write-Host "`nFull test completed / 完全テスト完了" -ForegroundColor Green
        }
        
        default {
            Write-Host "Unknown action: $Action" -ForegroundColor Red
            Write-Host "未知のアクション: $Action" -ForegroundColor Red
            Write-Host ""
            Write-Host "Available actions / 利用可能なアクション:"
            Write-Host "  detect  - Detect running processes / 実行中プロセスを検出"
            Write-Host "  start   - Start Affinity Designer / Affinity Designerを開始" 
            Write-Host "  monitor - Monitor process status / プロセス状態を監視"
            Write-Host "  files   - Discover Affinity files / Affinityファイルを発見"
            Write-Host "  full    - Run all tests / 全テストを実行"
        }
    }
}
catch {
    Write-Error "Script execution failed: $($_.Exception.Message)"
    Write-Error "スクリプト実行失敗: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "POC script completed / 概念実証スクリプト完了" -ForegroundColor Green