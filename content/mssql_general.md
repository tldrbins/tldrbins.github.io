---
title: "MSSQL General"
date: 2024-6-27
tags: ["Database Dumping", "Privilege Escalation In Databases", "Mssql", "Database", "Windows"]
---

### Connect to MSSQL DB

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
impacket-mssqlclient '<USER>:<PASSWORD>@<TARGET>'
```

```console
# Without TLS
impacket-mssqlclient -windows-auth '<USER>:<PASSWORD>@<TARGET>'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# With Current User
sqlcmd -S '<TARGET>' -Q "<QUERY>"
```

```console
# With Cred
sqlcmd -S '<TARGET>' -U '<USER>' -P '<PASSWORD>' -d '<DB_NAME>' -Q "<QUERY>"
```

{{< /tabcontent >}}

---

### Basic Commands

```console
# Check mssql version
SELECT @@version;
```

```console
# Check current user
SELECT suser_name();
```

```console
# Check users
SELECT name FROM master..syslogins
```

```console
# Check users
SELECT name FROM master..syslogins WHERE sysadmin = '1';
```

```console
# Check service name and the account authorized to control the service
SELECT servicename, service_account FROM sys.dm_server_services;
```

```console
# List principals
SELECT name FROM sys.database_principals;
```

```console
# Check privilege over a principal from current user
SELECT entity_name, permission_name FROM fn_my_permissions('<PRINCIPAL>', 'USER');
```

```console
# Fix : Cannot resolve the collation conflict between "Latin1_General_CI_AI" and "SQL_Latin1_General_CP1_CI_AS"
SELECT entity_name collate DATABASE_DEFAULT,permission_name collate DATABASE_DEFAULT FROM fn_my_permissions('<PRINCIPAL>', 'USER');
```

```console
# Check privilege
SELECT entity_name, permission_name FROM fn_my_permissions(NULL, 'SERVER');
```

```console
# Show databases
SELECT name FROM master..sysdatabases;
```

```console
# Show current database
SELECT DB_NAME();
```

```console
# List tables and schema
SELECT table_name,table_schema from <DB_NAME>.INFORMATION_SCHEMA.TABLES;
```

```console
# Select all from table
SELECT * from <DB_NAME>.<TABLE_SCHEMA>.<TABLE_NAME>;
```

```console
# Get domain name
SELECT DEFAULT_DOMAIN();
```

```console
# Get domain RID
SELECT master.dbo.fn_varbintohexstr(SUSER_SID('<DOMAIN>\Domain Admins'))
```

```console
# Read a text file
SELECT * FROM OPENROWSET(BULK N'<FILE>', SINGLE_CLOB) AS Contents
```

---

### Create sa user

```console
CREATE LOGIN '<USER>' WITH PASSWORD = '<PASSWORD>';
```

```console
EXEC sp_addsrvrolemember '<USER>', 'sysadmin';
```
