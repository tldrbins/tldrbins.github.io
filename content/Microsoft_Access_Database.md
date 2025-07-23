---
title: "Microsoft Access Database"
date: 2025-7-23
tags: ["Database Dumping", "Access", "Database", "Windows", "Mdb"]
---

### General

{{< tab set1 tab1 >}}mdbtools{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Installation \[Optional\]

```console
sudo apt install mdbtools
```

#### Show All Tables

```console
mdb-tables <MDB_FILE> 
```

```console {class="sample-code"}
$ mdb-tables backup.mdb                                                    
acc_antiback acc_door acc_firstopen acc_firstopen_emp acc_holidays acc_interlock ---[SNIP]---
```

#### Show Tables with Data

```console
mdb-tables <MDB_FILE> | tr ' ' '\n' | grep . | while read table; do lines=$(mdb-export <MDB_FILE> $table | wc -l); if [ $lines -gt 1 ]; then echo "$table: $lines"; fi; done
```

```console {class="sample-code"}
$ mdb-tables backup.mdb | tr ' ' '\n' | grep . | while read table; do lines=$(mdb-export backup.mdb $table | wc -l); if [ $lines -gt 1 ]; then echo "$table: $lines"; fi; done
acc_timeseg: 2
acc_wiegandfmt: 12
ACGroup: 6
action_log: 25
areaadmin: 4
auth_user: 4
---[SNIP]---
```

#### Dump Data from Table

```console
mdb-export <MDB_FILE> <TABLE_NAME>
```

```console {class="sample-code"}
$ mdb-export backup.mdb auth_user
id,username,password,Status,last_login,RoleID,Remark
25,"admin","admin",1,"08/23/18 21:11:47",26,
27,"engineer","access4u@security",1,"08/23/18 21:13:36",26,
28,"backup_admin","admin",1,"08/23/18 21:14:02",26,
```

{{< /tabcontent >}}
