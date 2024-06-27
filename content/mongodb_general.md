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

#### Basic Commands

```mongodb
# Show all databases
show dbs

# Choose database
use db_name

# Show all collections
show collections

# Show all of the collection
db.COLLECTION_NAME.find().pretty()
```

<br>