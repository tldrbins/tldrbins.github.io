---
title: "SSH"
date: 2024-6-26
tags: ["ssh", "private key", "public key", "id_rsa"]
---

---
### Check SSH version

[openssh-server (ubuntu)](https://packages.ubuntu.com/search?keywords=openssh-server)
<br>
[openssh-server (debian)](https://packages.debian.org/search?keywords=openssh-server)

---

### Generate SSH Key

```bash
ssh-keygen

#Set filename, leave passphase blank
./id_rsa

#After Creation
chmod 600 id_rsa
```

### Generate no passphrase SSH key from encrypted key

```bash
openssl rsa -in id_rsa_encrypted -out ./id_rsa
```

### Add SSH Access to Target

```bash
cat id_rsa.pub

#Copy and Paste to Target
echo '<id_rsa.pub>' >> /home/user/.ssh/authorized_keys
```

### Connect to SSH with id_rsa

```bash
ssh user@10.10.11.10 -i id_rsa
```

```bash
# Fix: no matching host key type found. Their offer: ssh-rsa,ssh-dss
ssh user@10.10.11.10 -i id_rsa -oHostKeyAlgorithms=+ssh-rsa

# Fix: sign_and_send_pubkey: no mutual signature supported 
ssh user@10.10.11.10 -i id_rsa -o PubkeyAcceptedKeyTypes=ssh-rsa
```

<small>*Note: Always append a new line in id_rsa key*</small>

### Connect to SSH with creds

```bash
ssh user@10.10.11.10

# After first connection (i.e., after 'yes' to fingerprint prompt)
sshpass -p 'password' ssh user@10.10.11.10
```

<br>