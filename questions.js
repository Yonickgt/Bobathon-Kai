// questions.js — Git Battle question bank
window.QUESTIONS = [
  // ─── BEGINNER — setup ───────────────────────────────────────────────────────
  {
    id: "b-001",
    tier: "beginner",
    category: "setup",
    type: "flashcard",
    question: "How do you initialise a new Git repository in the current directory?",
    answer: "git init",
    keywords: ["git", "init"],
    hint: "Creates a hidden .git folder in the current directory"
  },
  {
    id: "b-002",
    tier: "beginner",
    category: "setup",
    type: "flashcard",
    question: "How do you clone a remote repository to your local machine?",
    answer: "git clone <url>",
    keywords: ["git", "clone"],
    hint: "Downloads the entire repository history and sets up a remote called origin"
  },
  {
    id: "b-003",
    tier: "beginner",
    category: "setup",
    type: "flashcard",
    question: "How do you set your global Git username?",
    answer: "git config --global user.name \"Your Name\"",
    keywords: ["git", "config", "global", "user.name"],
    hint: "This name appears in every commit you make"
  },
  {
    id: "b-004",
    tier: "beginner",
    category: "setup",
    type: "flashcard",
    question: "How do you set your global Git email address?",
    answer: "git config --global user.email \"you@example.com\"",
    keywords: ["git", "config", "global", "user.email"],
    hint: "This email is attached to every commit you make"
  },
  {
    id: "b-005",
    tier: "beginner",
    category: "setup",
    type: "flashcard",
    question: "How do you add a remote named 'origin' pointing to a URL?",
    answer: "git remote add origin <url>",
    keywords: ["git", "remote", "add", "origin"],
    hint: "Links your local repo to a hosted remote repository"
  },
  // ─── BEGINNER — staging ──────────────────────────────────────────────────────
  {
    id: "b-006",
    tier: "beginner",
    category: "staging",
    type: "flashcard",
    question: "How do you stage a specific file for the next commit?",
    answer: "git add <file>",
    keywords: ["git", "add"],
    hint: "Moves changes from the working tree into the index"
  },
  {
    id: "b-007",
    tier: "beginner",
    category: "staging",
    type: "flashcard",
    question: "How do you stage all changed files in the current directory?",
    answer: "git add .",
    keywords: ["git", "add", "."],
    hint: "The dot means 'everything in the current directory tree'"
  },
  {
    id: "b-008",
    tier: "beginner",
    category: "staging",
    type: "flashcard",
    question: "How do you check which files are staged, unstaged, or untracked?",
    answer: "git status",
    keywords: ["git", "status"],
    hint: "Shows the state of your working tree and index"
  },
  {
    id: "b-009",
    tier: "beginner",
    category: "staging",
    type: "flashcard",
    question: "How do you see unstaged changes in your working tree?",
    answer: "git diff",
    keywords: ["git", "diff"],
    hint: "Compares the working tree against the index"
  },
  {
    id: "b-010",
    tier: "beginner",
    category: "staging",
    type: "flashcard",
    question: "How do you see changes that are already staged (indexed) but not yet committed?",
    answer: "git diff --staged",
    keywords: ["git", "diff", "staged"],
    hint: "Compares the index against the last commit; also accepts --cached"
  },
  // ─── BEGINNER — committing ───────────────────────────────────────────────────
  {
    id: "b-011",
    tier: "beginner",
    category: "committing",
    type: "flashcard",
    question: "How do you create a commit with a message in one command?",
    answer: "git commit -m \"message\"",
    keywords: ["git", "commit", "-m"],
    hint: "The -m flag lets you supply the commit message inline"
  },
  {
    id: "b-012",
    tier: "beginner",
    category: "committing",
    type: "flashcard",
    question: "How do you modify the most recent commit (message or staged content)?",
    answer: "git commit --amend",
    keywords: ["git", "commit", "amend"],
    hint: "Replaces the tip commit with a new one — don't do this on pushed commits"
  },
  {
    id: "b-013",
    tier: "beginner",
    category: "committing",
    type: "flashcard",
    question: "How do you view the full commit history of the current branch?",
    answer: "git log",
    keywords: ["git", "log"],
    hint: "Shows commits newest-first with author, date, and message"
  },
  {
    id: "b-014",
    tier: "beginner",
    category: "committing",
    type: "flashcard",
    question: "How do you view the commit history in a compact one-line-per-commit format?",
    answer: "git log --oneline",
    keywords: ["git", "log", "oneline"],
    hint: "Shows a short hash and the first line of each commit message"
  },
  // ─── BEGINNER — remote-basics ────────────────────────────────────────────────
  {
    id: "b-015",
    tier: "beginner",
    category: "remote-basics",
    type: "flashcard",
    question: "How do you push your local main branch to the origin remote?",
    answer: "git push origin main",
    keywords: ["git", "push", "origin", "main"],
    hint: "Uploads commits to the remote branch named main"
  },
  {
    id: "b-016",
    tier: "beginner",
    category: "remote-basics",
    type: "flashcard",
    question: "How do you fetch and merge changes from the tracked remote branch in one step?",
    answer: "git pull",
    keywords: ["git", "pull"],
    hint: "Equivalent to git fetch followed by git merge"
  },
  {
    id: "b-017",
    tier: "beginner",
    category: "remote-basics",
    type: "flashcard",
    question: "How do you download remote changes without merging them into your branch?",
    answer: "git fetch",
    keywords: ["git", "fetch"],
    hint: "Updates remote-tracking branches but leaves your working branch untouched"
  },
  {
    id: "b-018",
    tier: "beginner",
    category: "remote-basics",
    type: "flashcard",
    question: "How do you list all remotes and their URLs?",
    answer: "git remote -v",
    keywords: ["git", "remote", "-v"],
    hint: "Shows fetch and push URLs for every configured remote"
  },
  {
    id: "b-019",
    tier: "beginner",
    category: "remote-basics",
    type: "flashcard",
    question: "How do you push a branch for the first time and set its upstream tracking in one command?",
    answer: "git push -u origin main",
    keywords: ["git", "push", "-u", "origin", "main"],
    hint: "-u is shorthand for --set-upstream; future git push/pull needs no arguments"
  },
  // ─── BEGINNER — gitignore ────────────────────────────────────────────────────
  {
    id: "b-020",
    tier: "beginner",
    category: "gitignore",
    type: "flashcard",
    question: "What is the purpose of a .gitignore file?",
    answer: "It tells Git which files and directories to ignore and not track.",
    keywords: ["gitignore", "ignore", "untracked"],
    hint: "Patterns listed here are excluded from git add and git status"
  },

  // ─── EXPERIENCED — rebase ────────────────────────────────────────────────────
  {
    id: "e-001",
    tier: "experienced",
    category: "rebase",
    type: "subjective",
    question: "You want to rebase your current branch onto main. What command do you run?",
    answer: "git rebase main",
    keywords: ["git", "rebase", "main"],
    hint: "Replays your commits on top of another branch"
  },
  {
    id: "e-002",
    tier: "experienced",
    category: "rebase",
    type: "subjective",
    question: "How do you start an interactive rebase to edit the last 3 commits?",
    answer: "git rebase -i HEAD~3",
    keywords: ["git", "rebase", "-i", "HEAD~3"],
    hint: "Opens an editor where you can squash, reword, reorder, or drop commits"
  },
  {
    id: "e-003",
    tier: "experienced",
    category: "rebase",
    type: "subjective",
    question: "After fixing a conflict during a rebase, what command continues the rebase?",
    answer: "git rebase --continue",
    keywords: ["git", "rebase", "continue"],
    hint: "Stage the resolved files with git add first, then run this"
  },
  {
    id: "e-004",
    tier: "experienced",
    category: "rebase",
    type: "subjective",
    question: "How do you abort an in-progress rebase and return to the state before it started?",
    answer: "git rebase --abort",
    keywords: ["git", "rebase", "abort"],
    hint: "Restores the branch to exactly where it was before the rebase began"
  },
  // ─── EXPERIENCED — upstream ──────────────────────────────────────────────────
  {
    id: "e-005",
    tier: "experienced",
    category: "upstream",
    type: "subjective",
    question: "How do you push a new local branch to origin and set it as the tracking upstream in one command?",
    answer: "git push --set-upstream origin <branch>",
    keywords: ["git", "push", "set-upstream", "origin"],
    hint: "After this, plain git push/pull will know where to push/pull"
  },
  {
    id: "e-006",
    tier: "experienced",
    category: "upstream",
    type: "subjective",
    question: "How do you change the upstream tracking branch of your current local branch to origin/main?",
    answer: "git branch --set-upstream-to=origin/main",
    keywords: ["git", "branch", "set-upstream-to"],
    hint: "Useful when a remote branch was renamed or when you cloned differently"
  },
  {
    id: "e-007",
    tier: "experienced",
    category: "upstream",
    type: "subjective",
    question: "How do you view the tracking (upstream) information for all local branches?",
    answer: "git branch -vv",
    keywords: ["git", "branch", "-vv"],
    hint: "Double -v shows the upstream name and whether you're ahead/behind"
  },
  {
    id: "e-008",
    tier: "experienced",
    category: "upstream",
    type: "subjective",
    question: "How do you remove the upstream tracking reference from the current branch?",
    answer: "git branch --unset-upstream",
    keywords: ["git", "branch", "unset-upstream"],
    hint: "After this, git push will require an explicit remote and branch name"
  },
  // ─── EXPERIENCED — tags ──────────────────────────────────────────────────────
  {
    id: "e-009",
    tier: "experienced",
    category: "tags",
    type: "subjective",
    question: "How do you create a lightweight tag named v1.0 at the current commit?",
    answer: "git tag v1.0",
    keywords: ["git", "tag", "v1.0"],
    hint: "A lightweight tag is just a named pointer — no extra metadata"
  },
  {
    id: "e-010",
    tier: "experienced",
    category: "tags",
    type: "subjective",
    question: "How do you create an annotated tag v1.0 with a message?",
    answer: "git tag -a v1.0 -m \"Release v1.0\"",
    keywords: ["git", "tag", "-a", "-m"],
    hint: "Annotated tags store tagger name, date, and message; preferred for releases"
  },
  {
    id: "e-011",
    tier: "experienced",
    category: "tags",
    type: "subjective",
    question: "How do you push a single tag (v1.0) to the origin remote?",
    answer: "git push origin v1.0",
    keywords: ["git", "push", "origin", "v1.0"],
    hint: "Tags are not pushed automatically by git push — you must specify them"
  },
  {
    id: "e-012",
    tier: "experienced",
    category: "tags",
    type: "subjective",
    question: "How do you push all local tags to the origin remote at once?",
    answer: "git push origin --tags",
    keywords: ["git", "push", "origin", "tags"],
    hint: "Pushes every tag that the remote does not yet have"
  },
  // ─── EXPERIENCED — advanced-reset ───────────────────────────────────────────
  {
    id: "e-013",
    tier: "experienced",
    category: "advanced-reset",
    type: "subjective",
    question: "How do you undo the last commit but keep its changes staged (in the index)?",
    answer: "git reset --soft HEAD~1",
    keywords: ["git", "reset", "soft", "HEAD~1"],
    hint: "Moves HEAD back one commit; staged changes are ready to re-commit"
  },
  {
    id: "e-014",
    tier: "experienced",
    category: "advanced-reset",
    type: "subjective",
    question: "How do you undo the last commit and unstage its changes, keeping them in the working tree?",
    answer: "git reset --mixed HEAD~1",
    keywords: ["git", "reset", "mixed", "HEAD~1"],
    hint: "--mixed is the default reset mode; changes appear as unstaged modifications"
  },
  {
    id: "e-015",
    tier: "experienced",
    category: "advanced-reset",
    type: "subjective",
    question: "How do you undo the last commit and discard all its changes completely?",
    answer: "git reset --hard HEAD~1",
    keywords: ["git", "reset", "hard", "HEAD~1"],
    hint: "Destructive — working tree and index are both reset to the previous commit"
  },
  {
    id: "e-016",
    tier: "experienced",
    category: "advanced-reset",
    type: "subjective",
    question: "What is the key difference between git reset and git revert when undoing a commit?",
    answer: "git reset rewrites history by moving HEAD; git revert creates a new commit that undoes the changes, preserving history.",
    keywords: ["reset", "revert", "history"],
    hint: "Use revert on shared/public branches to avoid rewriting shared history"
  },
  // ─── EXPERIENCED — cherry-pick ───────────────────────────────────────────────
  {
    id: "e-017",
    tier: "experienced",
    category: "cherry-pick",
    type: "subjective",
    question: "How do you apply a single commit from another branch onto your current branch?",
    answer: "git cherry-pick <hash>",
    keywords: ["git", "cherry-pick", "hash"],
    hint: "Creates a new commit with the same changes but a different SHA"
  },
  {
    id: "e-018",
    tier: "experienced",
    category: "cherry-pick",
    type: "subjective",
    question: "How do you cherry-pick a commit but stage its changes without automatically committing?",
    answer: "git cherry-pick --no-commit <hash>",
    keywords: ["git", "cherry-pick", "no-commit"],
    hint: "Lets you inspect or adjust the changes before committing manually"
  },
  {
    id: "e-019",
    tier: "experienced",
    category: "cherry-pick",
    type: "subjective",
    question: "How do you continue a cherry-pick after resolving a conflict?",
    answer: "git cherry-pick --continue",
    keywords: ["git", "cherry-pick", "continue"],
    hint: "Stage the resolved files with git add first, then run this"
  },
  {
    id: "e-020",
    tier: "experienced",
    category: "cherry-pick",
    type: "subjective",
    question: "How do you cherry-pick a range of commits from hash A (exclusive) to hash B (inclusive)?",
    answer: "git cherry-pick A..B",
    keywords: ["git", "cherry-pick", "range"],
    hint: "Uses the same two-dot range syntax as git log A..B"
  }
];

window.MATCHING_SETS = [
  // ─── INTERMEDIATE — branching ────────────────────────────────────────────────
  {
    id: "m-001",
    tier: "intermediate",
    category: "branching",
    type: "matching",
    pairs: [
      { left: "Create and switch to a new branch",   right: "git checkout -b <name>" },
      { left: "List all local branches",              right: "git branch" },
      { left: "Delete a local branch safely",         right: "git branch -d <name>" },
      { left: "Switch to an existing branch",         right: "git switch <name>" }
    ]
  },
  // ─── INTERMEDIATE — merging ──────────────────────────────────────────────────
  {
    id: "m-002",
    tier: "intermediate",
    category: "merging",
    type: "matching",
    pairs: [
      { left: "Merge a branch into the current branch",           right: "git merge <branch>" },
      { left: "Merge without fast-forward, always creating a merge commit", right: "git merge --no-ff <branch>" },
      { left: "Abort an in-progress merge",                       right: "git merge --abort" },
      { left: "Show a visual graph of branch and merge history",  right: "git log --oneline --graph --all" }
    ]
  },
  // ─── INTERMEDIATE — history ──────────────────────────────────────────────────
  {
    id: "m-003",
    tier: "intermediate",
    category: "history",
    type: "matching",
    pairs: [
      { left: "Show full diff introduced by a specific commit",   right: "git show <hash>" },
      { left: "Search all commits whose message matches a pattern", right: "git log --grep=\"<pattern>\"" },
      { left: "Show who last changed each line of a file",        right: "git blame <file>" },
      { left: "Find the commit that introduced a bug via binary search", right: "git bisect start" }
    ]
  },
  // ─── INTERMEDIATE — undoing ──────────────────────────────────────────────────
  {
    id: "m-004",
    tier: "intermediate",
    category: "undoing",
    type: "matching",
    pairs: [
      { left: "Discard unstaged changes in a file",               right: "git checkout -- <file>" },
      { left: "Unstage a file without discarding changes",        right: "git restore --staged <file>" },
      { left: "Create a new commit that reverses a given commit", right: "git revert <hash>" },
      { left: "Temporarily shelve uncommitted changes",           right: "git stash" }
    ]
  },
  // ─── INTERMEDIATE — remote-advanced ─────────────────────────────────────────
  {
    id: "m-005",
    tier: "intermediate",
    category: "remote-advanced",
    type: "matching",
    pairs: [
      { left: "Delete a remote branch",                           right: "git push origin --delete <branch>" },
      { left: "Fetch all remotes and prune deleted remote branches", right: "git fetch --all --prune" },
      { left: "Show details about the origin remote",             right: "git remote show origin" },
      { left: "Rename the remote called origin to upstream",      right: "git remote rename origin upstream" }
    ]
  }
];
