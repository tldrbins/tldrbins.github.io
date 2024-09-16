---
title: "Linux hard disk encryption"
date: 2024-7-10
tags: ["luks", "Linux hard disk encryption", "privesc"]
---

### Brute force LUKS password

```console
bruteforce-luks -t 10 -f <WORDLIST> -w state.txt -v 30 <BACKUP_IMG>
```

<small>*Note: This is slow, create a small wordlist*</small>

### Basic

```console
# Open
cryptsetup open --type luks <BACKUP_IMG> backup
```

```console
# Check
ls -l /dev/mapper/
```

```console
# Create mount folder
sudo mkdir /mnt/backup
```

```console
# Mount
sudo mount /dev/mapper/backup /mnt/backup/
```
