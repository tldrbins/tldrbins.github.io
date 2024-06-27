---
title: "SSH"
date: 2024-6-26
tags: ["ssh", "private key", "public key", "id_rsa"]
---

---
### Generate SSH Key

```bash
ssh-keygen

#Set filename, leave passphase blank
./id_rsa

#After Creation
chmod 600 id_rsa
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

<small>*Note: Always append a new line in id_rsa key*</small>

### Connect to SSH with creds

```bash
ssh user@10.10.11.10

# After first connection (i.e., after 'yes' to fingerprint prompt)
sshpass -p 'password' ssh user@10.10.11.10
```

<br>