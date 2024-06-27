---
title: "git"
date: 2024-6-28
tags: ["git", "git-dumper"]
---

---
### Basic Commands

```bash
# Show status
git status

# Reset the current branch to a previous commit
git reset --hard

# Show information about files
git ls-files --stage

# Show current branch
git branch

# Show commits
git log 'branch_name' --oneline

# Show diff, a and b are commit hash
# a is older commit
git diff [a] [b]

# Show commit
git show 'commit_hash'
```

<br>

---

### git-dumper

[Download git-dumper](https://github.com/arthaud/git-dumper)

```bash
git-dumper http://10.10.11.10/.git result/
```

<br>