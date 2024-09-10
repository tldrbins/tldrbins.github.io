---
title: "Microsoft Oulook Email Folder"
date: 2024-7-8
tags: ["outlook", "email", "Windows", "pst", "ost", "mbox"]
---

---
### Open email file

{{< tab set1 tab1 active >}}.pst{{< /tab >}}
{{< tab set1 tab2 >}}.msg{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Tools

<div>

```bash
sudo apt install readpst
```

</div>

#### Basic

<div>

```bash
# Convert to mbox format
readpst emails.pst
```

```bash
# Open .mbox (plaintext)
cat emails.mbox
```

</div>

#### Read many emails

<div>

```bash
# Install mutt
sudo apt install mutt
```

```bash
# Open in mutt terminal
mutt -Rf emails.mbox
```

```bash
+--------------------------------------+
| Note: Answer No to create /root/Mail |
|                                      |
| Arrow   : Move to the email          |
| Enter   : View email                 |
| q       : back                       |
| q again : quit                       |
+--------------------------------------+
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Tools

<div>

```bash
# Install msgconvert
sudo apt install libemail-outlook-message-perl
```

```bash
# Install formail
sudo apt install procmail
```

</div>

#### Basic

<div>

```bash
# Convert to .eml format
msgconvert *.msg
```

```bash
# Convert to .mbox format
cat messages.eml | formail -b > emails.mbox
```

</div>

{{< /tabcontent >}}

<br>