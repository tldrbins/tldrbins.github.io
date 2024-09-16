---
title: "Mount Share"
date: 2024-6-26
tags: ["smb", "share", "mount", "cifs", "enum", "nfs"]
---

{{< tab set1 tab1 active >}}nfs{{< /tab >}}
{{< tab set1 tab2 >}}smb{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### List share

```console
showmount -e <TARGET>
```

#### Mount share

```console
sudo mount -t nfs <TARGET>:/share /mnt/share/
```

#### Unmount share

```console
sudo umount /mnt/share/
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Mount share

```console
sudo mount -t cifs //<TARGET>/share /mnt
```

```console
# Without creds
sudo mount -t cifs -o user=,password= //<TARGET>/share /mnt
```

```console
# With creds
sudo mount -t cifs -o user='<USER>',pass='<PASSWORD>' //<TARGET>/share /mnt
```

#### Mount inside Windows

```console
# Mount
net use \\localhost\c$ /u:'<DOMAIN>\<USER>' '<PASSWORD>'
```

```console
# Check
dir \\localhost\c$\users\administrator\desktop
```

{{< /tabcontent >}}

---

### Abuse #1: Misconfigured Share

```console
# Check all mounted drives
mount
```

```console
# Check how shares are mounted
cat /etc/exports
```

<br>

```console
+-----------------------------------------------------------------------------------------+
| root_squash  : running as root on local system will be treated as nobody user in target |
| no_all_squash: every other users permission will translate from local system to target  |
+-----------------------------------------------------------------------------------------+
```

<br>

```console
# Add dummy user
sudo useradd dummy
```

```console
# Change uid
sudo usermod -u 1001 dummy 
```

```console
# Switch to dummy user
sudo su dummy -c bash
```
