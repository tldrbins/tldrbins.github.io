---
title: "VPN"
date: 2024-7-9
tags: ["internet key exchange", "ike", "vpn", "udp"]
---

---
### Enum

```bash
# Check with ikeV1
ike-scan -M <TARGET>
```

```bash
# Check with ikeV2
ike-scan -M --ikev2 <TARGET>
```

### Connect to VPN

#### Tools

```bash
sudo apt install strongswan
```

#### Settings

```bash
# Edit /etc/ipsec.secrets
%any : PSK <PASSWORD>
```

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

#### Connect

```bash
# Reset
ipsec restart
```

```bash
# Connect
ipsec up testvpn
```

<br>