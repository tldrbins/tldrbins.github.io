---
title: "SSH"
date: 2024-6-26
tags: ["ssh", "private key", "public key", "id_rsa", "ppk", "pem", "openssh"]
---

---
### Check SSH version

[openssh-server (ubuntu)](https://packages.ubuntu.com/search?keywords=openssh-server)
<br>
[openssh-server (debian)](https://packages.debian.org/search?keywords=openssh-server)

---
### Config Location

```bash
/etc/ssh/sshd_config
```

```bash
# Grep contents
grep -Ev "^#" /etc/ssh/sshd_config | grep .
```

### Generate SSH Key

```bash
ssh-keygen
```

```bash
#Set filename, leave passphase blank
./id_rsa
```

```bash
#After Creation
chmod 600 id_rsa
```

### Check Public Key

```bash
ssh-keygen -l -f id_rsa
```

### Generate no passphrase SSH key from encrypted key

```bash
openssl rsa -in id_rsa_encrypted -out ./id_rsa
```

### Add SSH Access to Target

```bash
cat id_rsa.pub
```

```bash
#Copy and Paste to Target
echo <id_rsa.pub> >> /home/<USER>/.ssh/authorized_keys
```

### Connect to SSH with id_rsa

```bash
ssh <USER>@<TARGET> -i id_rsa
```

```bash
# Fix: no matching host key type found. Their offer: ssh-rsa,ssh-dss
ssh <USER>@<TARGET> -i id_rsa -oHostKeyAlgorithms=+ssh-rsa
```

```bash
# Fix: sign_and_send_pubkey: no mutual signature supported 
ssh <USER>@<TARGET> -i id_rsa -o PubkeyAcceptedKeyTypes=ssh-rsa
```

<small>*Note: Always append a new line in id_rsa key*</small>

### Connect to SSH with creds

```bash
ssh <USER>@<TARGET>
```

```bash
# After first connection (i.e., after 'yes' to fingerprint prompt)
sshpass -p <PASSWORD> ssh <USER>@<TARGET>
```

### Connect to SSH with target shell (bypass restricted shell)

```bash
ssh <USER>@<TARGET> -t bash
```

### Convert .ppk to .pem format

```bash
# Install
sudo apt install putty-tools
```

```bash
# Convert to private key in pem format
puttygen key.ppk -O private-openssh -o key.pem
```

```bash
# Convert to public key in pem format
puttygen key.ppk -O public-openssh -o key.pem.pub
```

<br>