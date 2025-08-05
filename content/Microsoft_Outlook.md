---
title: "Microsoft Oulook Email Folder"
date: 2025-7-25
tags: ["Outlook", "Email", "Windows", "Pst", "Ost", "Mbox"]
---

### Open Email File

{{< tab set1 tab1 >}}.pst{{< /tab >}}
{{< tab set1 tab2 >}}.msg{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Tools

```console
sudo apt install pst-utils
```

#### General

```console
# Convert to mbox format
readpst '<PST_FILE>'
```

```console {class="sample-code"}
$ readpst 'Access Control.pst'
Opening PST file and indexes...
Processing Folder "Deleted Items"
        "Access Control" - 2 items done, 0 items skipped.
```

```console
# Open .mbox (plaintext)
cat '<MBOX_FILE>'
```

```console {class="sample-code"}
$ cat 'Access Control.mbox'
From "john@megacorp.com" Fri Aug 24 07:44:07 2018
Status: RO
From: john@megacorp.com <john@megacorp.com>
Subject: MegaCorp Access Control System "security" account
To: 'security@accesscontrolsystems.com'
Date: Thu, 23 Aug 2018 23:44:07 +0000
MIME-Version: 1.0
Content-Type: multipart/mixed;
        boundary="--boundary-LibPST-iamunique-41717394_-_-"


----boundary-LibPST-iamunique-41717394_-_-
Content-Type: multipart/alternative;
        boundary="alt---boundary-LibPST-iamunique-41717394_-_-"

--alt---boundary-LibPST-iamunique-41717394_-_-
Content-Type: text/plain; charset="utf-8"

Hi there,

 

The password for the “security” account has been changed to 4Cc3ssC0ntr0ller.  Please ensure this is passed on to your engineers.

 

Regards,

John


--alt---boundary-LibPST-iamunique-41717394_-_-
---[SNIP]---
```

#### Read Many Emails

```console
# Install mutt
sudo apt install mutt
```

```console
# Open in mutt terminal
mutt -Rf '<MBOX_FILE>'
```

```console {class="sample-code"}
$ mutt -Rf 'Access Control.mbox'

q:Quit  d:Del  u:Undel  s:Save  m:Mail  r:Reply  g:Group  ?:Help                                                                                                                                                   
   1     Aug 23 john@megacorp.c (  76) MegaCorp Access Control System "security" account
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

#### General

```console
# Convert to .eml format
msgconvert *.msg
```

```console {class="sample-code"}
$ msgconvert *.msg
```

```console
# Convert to .mbox format
cat <EML_FILE> | formail -b > emails.mbox
```

```console {class="sample-code"}
$ cat emails.eml | formail -b > emails.mbox
```

{{< /tabcontent >}}
