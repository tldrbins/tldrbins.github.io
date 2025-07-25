---
title: "Share Mount"
date: 2024-6-26
tags: ["NFS", "Mount", "Smb", "File System Mounting", "Enumeration", "Share", "Cifs", "File System Permissions Vulnerabilities"]
---

{{< tab set1 tab1 >}}nfs{{< /tab >}}
{{< tab set1 tab2 >}}smb{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### List Shares

```console
showmount -e <TARGET>
```

```console {class="sample-code"}
$ showmount -e 10.10.11.191
Export list for 10.10.11.191:
/home/ross    *
/var/www/html *
```

#### Mount Share

```console
sudo mkdir /mnt/share
```

```console {class="sample-code"}
$ sudo mkdir /mnt/share
```

```console
sudo mount -t nfs <TARGET>:<SHARE> /mnt/share/
```

```console {class="sample-code"}
$ sudo mount -t nfs 10.10.11.191:/home/ross /mnt/share/

$ ls /mnt/share 
Desktop  Documents  Downloads  Music  Pictures  Public  Templates  Videos
```

#### Unmount Share

```console
sudo umount /mnt/share/
```

```console {class="sample-code"}
$ sudo umount /mnt/share/
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Mount Share

```console
sudo mount -t cifs //<TARGET>/<SHARE> /mnt
```

```console
# Without creds
sudo mount -t cifs -o user=,password= //<TARGET>/<SHARE> /mnt
```

```console
# With creds
sudo mount -t cifs -o user='<USER>',pass='<PASSWORD>' //<TARGET>/<SHARE> /mnt
```

```console {class="sample-code"}
$ sudo mount -t cifs -o ro,user='localadmin',password='Secret123' //10.10.11.102/Shared /mnt

$ ls /mnt      
Documents  Software
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

```console {class="sample-code"}
$ mount     

---[SNIP]---
10.10.11.191:/home/ross on /mnt/share type nfs4 (rw,relatime,vers=4.2,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.10.14.31,local_lock=none,addr=10.10.11.191)
```

```console
# Check how shares are mounted
cat /etc/exports
```

```console {class="sample-code"}
$ cat /etc/exports
/var/nfsshare *(rw,sync,root_squash,no_all_squash)
/opt *(rw,sync,root_squash,no_all_squash)
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

```console {class="sample-code"}
$ sudo useradd dummy
```

```console
# Change uid
sudo usermod -u 1001 dummy 
```

```console {class="sample-code"}
$ sudo usermod -u 1001 dummy
```

```console
# Switch to dummy user
sudo su dummy -c bash
```

```console {class="sample-code"}
$ sudo su dummy
$ id
uid=1001(dummy) gid=1001(dummy) groups=1001(dummy)
```
