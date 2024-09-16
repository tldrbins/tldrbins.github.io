---
title: "Firefox"
date: 2024-7-9
tags: ["firefox", "mozilla", "creds", "password"]
---

### Extract saved passwords

{{< tab set1 tab1 active >}}firefox_decrypt{{< /tab >}}
{{< tab set1 tab2 >}}firepwd{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Auto detect path
python3 firefox_decrypt.py
```

```console
# Specify path
python3 firefox_decrypt.py /<PATH>/profiles.ini/
```

<small>*Ref: [firefox_decrypt](https://github.com/unode/firefox_decrypt)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# With key4.db, logins.json in the same directory
python3 firepwd.py
```

<small>*Ref: [firepwd](https://github.com/lclevy/firepwd)*</small>

{{< /tabcontent >}}
