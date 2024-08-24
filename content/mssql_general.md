---
title: "MSSQL General"
date: 2024-6-27
tags: ["mssql", "database", "Windows"]
---

---
### General

#### Connect to MSSQL DB (From Linux)

```bash
impacket-mssqlclient '<USER>:<PASSWORD>@<TARGET>'
```

```bash
# Without TLS
impacket-mssqlclient -windows-auth '<USER>:<PASSWORD>@<TARGET>'
```

#### Connect to MSSQL DB (From Windows)

```powershell
# With inline query
sqlcmd -S <TARGET> -U <USER> -P <PASSWORD> -d <DB_NAME> -Q "SELECT @@version;"
```

#### Basic Commands

```mysql
# Check mssql version
SELECT @@version;
```

```mysql
# Check users
SELECT name FROM master..syslogins
```

```mysql
# Check users
SELECT name FROM master..syslogins WHERE sysadmin = '1';
```

```mysql
# Check service name and the account authorized to control the service
SELECT servicename, service_account FROM sys.dm_server_services;
```

```mysql
# List principals
SELECT name FROM sys.database_principals;
```

```mysql
# Check privilege over a principal from current user
SELECT entity_name, permission_name FROM fn_my_permissions('<PRINCIPAL>', 'USER');
```

```mysql
# Fix : Cannot resolve the collation conflict between "Latin1_General_CI_AI" and "SQL_Latin1_General_CP1_CI_AS"
SELECT entity_name collate DATABASE_DEFAULT,permission_name collate DATABASE_DEFAULT FROM fn_my_permissions('<PRINCIPAL>', 'USER');
```

```mysql
# Check privilege
SELECT entity_name, permission_name FROM fn_my_permissions(NULL, 'SERVER');
```

```mysql
# Show databases
SELECT name FROM master..sysdatabases;
```

```mysql
# Show current database
SELECT DB_NAME();
```

```mysql
# List tables and schema
SELECT table_name,table_schema from <DB_NAME>.INFORMATION_SCHEMA.TABLES;
```

```mysql
# Select all from table
SELECT * from <DB_NAME>.<TABLE_SCHEMA>.<TABLE_NAME>;
```

```mysql
# Get domain name
SELECT DEFAULT_DOMAIN();
```

```mysql
# Get domain RID
SELECT master.dbo.fn_varbintohexstr(SUSER_SID('EXAMPLE\Domain Admins'))
```

```mysql
# Read a text file
SELECT * FROM OPENROWSET(BULK N'C:\users\administrator\desktop\root.txt', SINGLE_CLOB) AS Contents
```

#### Create sa user

```mysql
CREATE LOGIN '<USER>' WITH PASSWORD = '<PASSWORD>';
```

```mysql
EXEC sp_addsrvrolemember '<USER>', 'sysadmin';
```

<br>