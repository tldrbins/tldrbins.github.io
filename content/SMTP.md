---
title: "SMTP"
date: 2024-7-5
tags: ["Nmap", "Enumeration", "SMTP", "Mail", "Email", "Template"]
---

### Simple Mail Debugging Server

```python
#!/usr/bin/env python3

import aiosmtpd.controller

class CustomSMTPHandler:
    async def handle_DATA(self, server, session, envelope):
        print(f"[+] Received a mail.")
        print("=" * 50)
        print(envelope.content.decode())
        print("=" * 50)
        return "250 OK"

handler = CustomSMTPHandler()
server = aiosmtpd.controller.Controller(handler, hostname="0.0.0.0", port=25)
server.start()
print("[*] Listening on 0.0.0.0:25")
input("[*] Server started. Press Return to quit.\n")
server.stop()
```

### Users Enum

{{< tab set1 tab1 >}}nmap script{{< /tab >}}
{{< tab set1 tab2 >}}smtp-user-enum{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
nmap -p 25 --script=smtp-enum-users <TARGET>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Use RCPT
smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/cirt-default-usernames.txt -t <TARGET>
```

```console
# Use VRFY
smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/cirt-default-usernames.txt -t <TARGET>
```

<small>*Ref: [smtp-user-enum.pl](https://raw.githubusercontent.com/pentestmonkey/smtp-user-enum/master/smtp-user-enum.pl)*</small>

{{< /tabcontent >}}
