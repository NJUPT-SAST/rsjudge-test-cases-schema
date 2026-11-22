# rsjudge-test-cases-schema

The problem package format and the configuration schema of
[rsjudge](https://github.com/NJUPT-SAST/rsjudge).

## Problem package

A problem is a `.tar.zst` archive. Its root holds `problem.toml` and the
resources that file names:

```text
sum.tar.zst
├── problem.toml
├── 1.in
├── 1.ans
├── 2.in
└── 2.ans
```

The archive holds regular files and directories only. Every entry path is
relative to the archive root, and entries that leave the root are rejected.
Resources may live in subdirectories, and the `input`, `answer`, `checker` and
`interactor` paths in `problem.toml` resolve against the archive root.

## `problem.toml`

```toml
score = 100

[judge]
judgeType = "classic"

[resourceLimits]
time = 1000
memory = 256

[task]
taskType = "simple"

[[task.cases]]
input = "1.in"
answer = "1.ans"

[[task.cases]]
input = "2.in"
answer = "2.ans"
score = 60
```

### Fields

- `score`: the total score of the problem.
- `judge`: one of
  - `judgeType = "classic"` — compare the output with the answer;
  - `judgeType = "special-judge"` with `checker = "..."` — run a trusted
    checker on the input, the answer and the output;
  - `judgeType = "interactive"` with `interactor = "..."` — run a trusted
    interactor that talks to the submission.
- `resourceLimits`:
  - `time`: the CPU time limit in milliseconds. `0` means unlimited.
  - `memory`: the address-space limit in megabytes. `0` means unlimited.
- `task`: one of
  - `taskType = "simple"` with a `cases` array — every case is scored on its
    own;
  - `taskType = "subtask"` with a `subtasks` array — every subtask is scored
    as a whole.
- Every case has an `input` path, an `answer` path and an optional `score`.
  When no case names a score, the problem's total score is divided evenly among
  the cases.
- Every subtask has a `cases` array and an optional `score`. When no subtask
  names a score, the problem's total score is divided evenly among the
  subtasks. A subtask earns its score only when every case passes.

## Reference examples

`out/` holds one configuration per judge type and task type combination:

| File | `judgeType` | `taskType` |
|------|-------------|------------|
| `classic-simple` | `classic` | `simple` |
| `classic-subtasks` | `classic` | `subtask` |
| `special-judge-subtasks` | `special-judge` | `subtask` |
| `interactive-simple` | `interactive` | `simple` |

Each one exists as both `.json` and `.toml`. They are the cross-language
contract: the Rust implementation in
[`rsjudge-test-cases-schema`](https://github.com/NJUPT-SAST/rsjudge/tree/main/crates/rsjudge-test-cases-schema)
parses them in its test suite, so a change to either implementation that the
other cannot read fails that repository's CI.

The files are generated and carry no license header of their own. Every one
ends with a newline, so `cat out/classic-simple.json` and a diff against a
freshly generated copy behave the way a text file is expected to.

## Implementations

- **TypeScript**: `rsjudge-schema.d.ts` declares the types, and `index.ts`
  generates the reference examples in `out/`.
- **Rust**: the serde implementation lives in the main repository, as
  [`crates/rsjudge-test-cases-schema`](https://github.com/NJUPT-SAST/rsjudge/tree/main/crates/rsjudge-test-cases-schema).
  It is not published as a crate; only rsjudge consumes it.

## Development

The TypeScript side was created with [Bun](https://bun.sh/). Install it, then
regenerate the reference examples:

```bash
bun install
bun run index.ts
```

Regeneration is deterministic: running it twice produces byte-identical files,
and re-running it on a clean checkout leaves `out/` unchanged.
