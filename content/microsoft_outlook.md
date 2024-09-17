---
title: "Microsoft Oulook Email Folder"
date: 2024-7-8
tags: ["Outlook", "Email", "Windows", "Pst", "Ost", "Mbox"]
---

### Open email file

{{< tab set1 tab1 active >}}.pst{{< /tab >}}
{{< tab set1 tab2 >}}.msg{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Tools

```console
sudo apt install readpst
```

#### Basic

```console
# Convert to mbox format
readpst <PST_FILE>
```

```console
# Open .mbox (plaintext)
cat <MBOX_FILE>
```

#### Read many emails

```console
# Install mutt
sudo apt install mutt
```

```console
# Open in mutt terminal
mutt -Rf <MBOX_FILE>
```

```console
+--------------------------------------+
| Note: Answer No to create /root/Mail |
|                                      |
| Arrow   : Move to the email          |
| Enter   : View email                 |
| q       : back                       |
| q again : quit                       |
+--------------------------------------+
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Tools

```console
# Install msgconvert
sudo apt install libemail-outlook-message-perl
```

```console
# Install formail
sudo apt install procmail
```

#### Basic

```console
# Convert to .eml format
msgconvert *.msg
```

```console
# Convert to .mbox format
cat <EML_FILE> | formail -b > emails.mbox
```

{{< /tabcontent >}}
