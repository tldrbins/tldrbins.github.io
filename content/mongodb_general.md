---
title: "MongoDB General"
date: 2024-6-27
tags: ["mongodb", "database"]
---

---
### General

#### Connect to Mongo Database

```bash
mongo 10.10.11.10:27017
```

```bash
# Connect local with creds and specified database
mongo -u user -p password db_name
```

#### Basic Commands

```bash
# Show all databases
show dbs
```

```bash
# Choose database
use db_name
```

```bash
# Show all collections
show collections
```

```bash
# Show all of the collection
db.COLLECTION_NAME.find().pretty()
```

```bash
# Insert entry into collections
db.COLLECTION_NAME.insert({"key": "value"})
```

<br>