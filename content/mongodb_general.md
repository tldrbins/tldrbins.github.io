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
mongo -u <USER> -p <PASSWORD> <DB_NAME>
```

#### Basic Commands

```bash
# Show all databases
show dbs
```

```bash
# Choose database
use <DB_NAME>
```

```bash
# Show all collections
show collections
```

```bash
# Show all of the collection
db.<COLLECTION_NAME>.find().pretty()
```

```bash
# Insert entry into collections
db.<COLLECTION_NAME>.insert({"<key>": "<value>"})
```

```bash
# Update an entry (e.g. password of user)
db.<COLLECTION_NAME>.update({"username": "user"}, {$set: {"password": "password"}});
```

<br>