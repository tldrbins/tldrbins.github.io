---
title: "MSSQL General"
date: 2024-6-27
tags: ["mssql", "database", "Windows"]
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
SELECT table_name,table_schema from db_name.INFORMATION_SCHEMA.TABLES;
```

```mysql
# Select all from table
SELECT * from db_name.table_schema.table_name;
```

```mysql
# Get domain name
SELECT DEFAULT_DOMAIN();
```

```mysql
# Get domain RID
SELECT master.dbo.fn_varbintohexstr(SUSER_SID('EXAMPLE\Domain Admins'))
```

<br>