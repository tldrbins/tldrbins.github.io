---
title: "Microsoft Oulook Email Folder"
date: 2024-7-8
tags: ["outlook", "email", "Windows", "pst", "ost", "mbox"]
---

---
### Open .pst file

#### Tool

```bash
sudo apt install readpst
```

#### Basic

```bash
# Convert to mbox format
readpst emails.pst
```

```bash
# Open .mbox (plaintext)
cat emails.mbox
```

#### Read many emails

```bash
# Use mutt
mutt -Rf emails.mbox
```

```bash
+------------------------------------+
|Note: Answer No to create /root/Mail|
|                                    |
|Arrow   : Move to the email         |
|Enter   : View email                |
|q       : back                      |
|q again : quit                      |
+------------------------------------+
```

<br>