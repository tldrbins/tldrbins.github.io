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
git log 'branch_name' --oneline
```

```bash
# Show diff, a and b are commit hash
# a is the older commit
git diff [a] [b]
```

```bash
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