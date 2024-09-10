---
title: "VPN"
date: 2024-7-9
tags: ["internet key exchange", "ike", "vpn", "udp"]
---

---
### Enum

<div>

```bash
# Check with ikeV1
ike-scan -M <TARGET>
```

```bash
# Check with ikeV2
ike-scan -M --ikev2 <TARGET>
```

</div>

### Connect to VPN

{{< tab set1 tab1 active >}}strongswan{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
sudo apt install strongswan
```

</div>

{{< /tabcontent >}}

#### Settings

<div>

```bash
# Edit /etc/ipsec.secrets
%any : PSK <PASSWORD>
```

</div>

<br>

<div>

```bash
# Edit /etc/ipsec.conf (copy from ike-scan result)
config setup
    charondebug="all"
    uniqueids=yes
    strictcrlpolicy=no

conn testvpn
    authby=secret
    auto=add
    ike=3des-sha1-modp1024!
    esp=3des-sha1!
    type=transport
    keyexchange=ikev1
    left=<LOCAL>
    right=<TARGET>
    rightsubnet=<TARGET>[tcp]
```

</div>

#### Connect

<div>

```bash
# Reset
ipsec restart
```

```bash
# Connect
ipsec up testvpn
```

</div>

<br>