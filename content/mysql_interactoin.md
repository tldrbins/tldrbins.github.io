---
title: "Mysql General"
date: 2024-6-27
tags: ["mysql", "database"]
---

---
### General

#### Connect to mysql Database

```bash
# Database unknown
mysql -u user -h 10.10.11.10 -p

# Database known
mysql -u user -D db_name -h 10.10.11.10 -p
```

#### Basic Commands

```mysql
# Show all databases
show databases;

# Choose database
use db_name;

# Show all tables
show tables;

# Show all entries in table_name
select * from table_name;
```

#### Update Entry

```mysql
# Update Entry Example
UPDATE users set user_type='Administrator' where email='test@example.com';
```

<br>