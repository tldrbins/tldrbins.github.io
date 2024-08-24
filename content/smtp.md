---
title: "SMTP"
date: 2024-7-5
tags: ["smtp", "mail", "email", "25", "enum", "template"]
---

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

### User Enum

#### nmap script

```bash
nmap -p 25 --script=smtp-enum-users <TARGET>
```

#### smtp-user-enum

```bash
# Use RCPT
smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/cirt-default-usernames.txt -t <TARGET>
```

```bash
# Use VRFY
smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/cirt-default-usernames.txt -t <TARGET>
```

<small>*Note: [smtp-user-enum.pl](https://raw.githubusercontent.com/pentestmonkey/smtp-user-enum/master/smtp-user-enum.pl)*</small>