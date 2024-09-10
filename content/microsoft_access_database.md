---
title: "Microsoft Access Database"
date: 2024-7-8
tags: ["Access", "database", "Windows", "mdb"]
---

---
### Tools

{{< tab set1 tab1 active >}}mdbtools{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
sudo apt install mdbtools
```

</div>

#### Basic

<div>

```bash
# Show all tables
mdb-tables database.mdb 
```

```bash
# Show tables with data
mdb-tables database.mdb | tr ' ' '\n' | grep . | while read table; do lines=$(mdb-export database.mdb $table | wc -l); if [ $lines -gt 1 ]; then echo "$table: $lines"; fi; done
```

```bash
# Dump data from table
mdb-export database.mdb <TABLE_NAME>
```

</div>

{{< /tabcontent >}}


<br>