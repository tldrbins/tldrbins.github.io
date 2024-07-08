---
title: "Postgresql"
date: 2024-7-9
tags: ["postgresql", "database"]
---

---
### General

#### Connect to postgresql Database

```bash
psql -h 127.0.0.1 -U user -p 5432 -d database
```

#### Basic Commands

```bash
# Dump data from table
select * from table_name;
```

```bash
# Insert data into table (e.g)
insert into table_name (username, password, role) values ('user', 'password', 'admin');
```

```bash
# Exit
\q
```

<br>