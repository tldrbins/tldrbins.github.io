---
title: "Mount Share"
date: 2024-6-26
tags: ["smb", "share", "mount", "cifs", "enum", "nfs"]
---

---
{{< tab set1 tab1 active >}}nfs{{< /tab >}}
{{< tab set1 tab2 >}}smb{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### List share

<div>

```bash
showmount -e 10.10.11.10
```

</div>

#### Mount share

<div>

```bash
sudo mount -t nfs 10.10.11.10:/share /mnt/share/
```

</div>

#### Unmount share

<div>

```bash
sudo umount /mnt/share/
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Mount share

<div>

```bash
sudo mount -t cifs //10.10.11.10/share /mnt
```

```bash
# Without creds
sudo mount -t cifs -o user=,password= //10.10.11.10/share /mnt
```

```bash
# With creds
sudo mount -t cifs -o user=<USER>,pass=<PASSWORD> //10.10.11.10/share /mnt
```

</div>

#### Mount inside Windows

<div>

```powershell
# Mount
net use \\localhost\c$ /u:<DOMAIN>\<USER> <PASSWORD>
```

```powershell
# Check
dir \\localhost\c$\users\administrator\desktop
```

</div>

{{< /tabcontent >}}

<br>

---

### Abuse #1: Misconfigured Share

<div>

```bash
# Check all mounted drives
mount
```

```bash
# Check how shares are mounted
cat /etc/exports
```

</div>

<br>

<div>

```bash
+-----------------------------------------------------------------------------------------+
| root_squash  : running as root on local system will be treated as nobody user in target |
| no_all_squash: every other users permission will translate from local system to target  |
+-----------------------------------------------------------------------------------------+
```

</div>

<br>

<div>

```bash
# Add dummy user
sudo useradd dummy
```

```bash
# Change uid
sudo usermod -u 1001 dummy 
```

```bash
# Switch to dummy user
sudo su dummy -c bash
```

</div>

<br>