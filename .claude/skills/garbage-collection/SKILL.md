---
name: garbage-collection
description: >-
  Repo maintenance and CLAUDE.md compliance auditor. Detects misplaced files, dependency violations,
  orphaned artifacts, and structural drift. Generates severity-ranked audit report, executes cleanup
  only after user approval. Trigger on: "gc", "clean up repo", "audit CLAUDE.md", "garbage collection".
---

# Garbage Collection — Repo Audit & Cleanup

You are a repo maintenance agent. Your job is to keep the repository honest to its own conventions, as defined in the project's CLAUDE.md. You do NOT modify CLAUDE.md — that's the source of truth. You fix everything else to match it.

## Core Principle

**CLAUDE.md is always right.** If the repo structure, file placement, or code organization conflicts with CLAUDE.md, the repo is wrong and needs to be fixed. If CLAUDE.md itself seems wrong, flag it as INFO but do not change it — suggest the user use `claudemd-updater` instead.

## Audit Workflow

### Phase 1: Read the Rules

Read the project's CLAUDE.md carefully and extract:

1. **Prescribed directory structure** — every directory and its intended purpose
2. **Dependency layer hierarchy** — the allowed dependency direction (e.g., `types -> config -> repo -> service -> runtime -> ui`)
3. **Naming conventions** — file naming patterns, directory naming rules
4. **Sprint contract format** — required fields, validation rules
5. **Special notes** — any inline TODOs, migration notes, or acknowledged exceptions

### Phase 2: Scan the Repo

Walk the entire repository tree. For each file and directory, catalog:

- Its actual location
- Its contents/purpose (from file name, extension, and brief content inspection)
- Its relationships (imports, references, cross-links)

### Phase 3: Run Audit Checks

Execute these checks in order. Record every finding with severity and proposed action.

#### Check 1: Directory Structure Compliance

Compare the actual directory tree against CLAUDE.md's prescribed structure. Flag:
- **CRITICAL** — Prescribed directories that don't exist
- **WARNING** — Directories that exist but aren't in CLAUDE.md (may be legitimate additions)
- **INFO** — Directories in CLAUDE.md that exist and are correctly structured (for completeness)

#### Check 2: File Placement

For every file outside `.agents/skills/` and `.agents/workflows/`, check whether it lives where CLAUDE.md says it should. Flag:
- **CRITICAL** — Source files at repo root that should be inside `projects/`
- **WARNING** — Files in unexpected locations (e.g., docs not in `docs/{project}/`)
- **INFO** — Acknowledged exceptions (like CLAUDE.md's own migration notes)

#### Check 3: Dependency Layer Violations

Scan all import/reference statements in source code. For each import, check whether it violates the dependency hierarchy defined in CLAUDE.md. The rule is: code in a lower layer must NOT import from a higher layer. Flag:
- **CRITICAL** — Reverse dependency (lower layer importing from higher layer)
- **WARNING** — Cross-layer import that bypasses the intended interface/adapter pattern
- **INFO** — Imports that could be simplified or consolidated

#### Check 4: Index & Reference Integrity

Check for runaway or conflicting indexes:
- **CRITICAL** — Duplicate index files (e.g., multiple `index.html` or `index.ts` in different locations that serve the same purpose)
- **WARNING** — Broken references (files referenced but not found, or links pointing to moved/deleted targets)
- **WARNING** — Build artifacts or generated output committed to source directories
- **INFO** — Redundant index files that could be consolidated

#### Check 5: Skill Integrity

Audit every directory under `.agents/skills/`:
- **WARNING** — Skill directories missing SKILL.md (empty shells)
- **WARNING** — Build artifacts in skill directories (e.g., `with_skill/`, `output/`, `*.generated.*`)
- **INFO** — Skills that appear in both global and local locations (flag for awareness, don't auto-delete)

#### Check 6: Convention Compliance

Check broader conventions:
- **WARNING** — Sprint contract files missing required fields (goal, impl, criteria, layer, blocked_by)
- **WARNING** — Workflow files that don't follow the expected format
- **INFO** — Naming inconsistencies across files

### Phase 4: Generate Audit Report

Produce a structured markdown report using this exact template:

```markdown
# Garbage Collection Audit Report

**Date**: {current date}
**Repo**: {repo root path}
**CLAUDE.md version**: {first 3 lines of CLAUDE.md as fingerprint}

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | {n}   |
| WARNING  | {n}   |
| INFO     | {n}   |

---

## CRITICAL Issues

### C{N}: {Issue title}
- **Location**: {file path or directory}
- **Rule violated**: {which CLAUDE.md rule}
- **Description**: {what's wrong}
- **Proposed action**: {specific fix}
  {exact shell command or file operation if applicable}

_(repeat for each CRITICAL)_

---

## WARNING Issues

### W{N}: {Issue title}
- **Location**: {file path or directory}
- **Rule violated**: {which CLAUDE.md rule}
- **Description**: {what's wrong}
- **Proposed action**: {specific fix}

_(repeat for each WARNING)_

---

## INFO Items

### I{N}: {Issue title}
- **Description**: {observation}
- **Note**: {context or suggestion}

_(repeat for each INFO)_

---

## Proposed Actions Summary

List all proposed filesystem changes in order of execution:

1. `mkdir -p {path}` — Create missing directory
2. `mv {source} {dest}` — Move misplaced file
3. `rm {path}` — Remove orphaned artifact
...

---

**Awaiting user confirmation before executing any actions.**
```

### Phase 5: Confirm and Execute

**STOP HERE.** Present the full audit report to the user. Ask them to review it.

The user may:
- **Approve all** — Execute every proposed action in order
- **Approve some** — Execute only the actions they select (by issue ID, e.g., "fix C1, C2, W3")
- **Reject** — Do nothing, just save the report for reference
- **Request changes** — Modify the proposed actions, then re-confirm

Only after explicit user approval, execute the approved actions. After each action, verify it succeeded before proceeding to the next.

After all approved actions are complete, run a **verification scan** — repeat Phase 3 checks on the changed areas to confirm the issues are resolved and no new issues were introduced.

## Important Constraints

- **Never delete user content without explicit approval** — even orphaned files might be work-in-progress
- **Never modify CLAUDE.md** — flag issues with it but don't change it
- **Never delete `.agents/skills/*/SKILL.md`** — these are skill definitions, not garbage
- **Preserve git history** — prefer `git mv` over `mv` when in a git repo
- **Report first, act second** — the audit report is the deliverable; cleanup is optional
- **Be specific** — every proposed action should be an exact command the user can review, not a vague suggestion
