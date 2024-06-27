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

<br>