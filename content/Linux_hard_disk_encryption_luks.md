---
title: "Linux hard disk encryption"
date: 2024-7-10
tags: ["luks", "Linux hard disk encryption", "privesc"]
---

---
### Brute force LUKS password

<div>

```bash
bruteforce-luks -t 10 -f wordlist.txt -w state.txt -v 30 backup.img
```

</div>

<small>*Note: This is slow, create a small wordlist*</small>

### Basic

<div>

```bash
# Open
cryptsetup open --type luks backup.img backup
```

```bash
# Check
ls -l /dev/mapper/
```

```bash
# Create mount folder
sudo mkdir /mnt/backup
```

```bash
# Mount
sudo mount /dev/mapper/backup /mnt/backup/
```

</div>

<br>
