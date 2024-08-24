---
title: "Linux hard disk encryption"
date: 2024-7-10
tags: ["luks", "Linux hard disk encryption", "privesc"]
---

---
### Brute force LUKS password

```bash
bruteforce-luks -t 10 -f wordlist.txt -w state.txt -v 30 backup.img
```

<small>*Note: This is slow, create a small wordlist*</small>

### Open

```bash
cryptsetup open --type luks backup.img backup
```

### Check

```bash
ls -l /dev/mapper/
```

### Mount

```bash
sudo mkdir /mnt/backup
```

```bash
sudo mount /dev/mapper/backup /mnt/backup/
```

<br>
