# AI Workflow Rules

## Approach

Build the Wordle-like game incrementally against these context documents. Distinguish user requirements from proposals and TBD choices. This initialization creates documentation only; feature implementation requires a subsequent implementation request.

## Scoping Rules

- Deliver small, verifiable units tied to the requested gameplay and dictionary support.
- Start with the standard dictionary as requested.
- Keep custom dictionary support in the overall plan; do not silently drop it or claim it is implemented.
- Avoid introducing accounts, remote services, or unrelated product features without a supported requirement.

## When to Split Work

Split work when it combines scoring changes, dictionary parsing, and interface changes that can be verified independently. Establish a playable standard-dictionary round before expanding custom-list management, unless the user requests another order.

## Handling Missing Requirements

- Record material open questions in `progress-tracker.md`.
- Resolve rules that affect correctness before implementing dependent behavior.
- Label suggested stack, rules, and design choices as proposals until selected.
- Use the user's stated preferences and existing project evidence rather than example values from templates.

## Protected Files

- Preserve the source templates under `/Users/altafr/.codex/skills/initproject/assets/context/`.
- Preserve existing project-specific context and progress history when updating documents.
- Do not edit Git internals or third-party dependency internals as part of initialization.

## Keeping Docs in Sync

Update relevant context files when scope, stack, dictionary policy, storage, code conventions, or design decisions change. Record implementation progress based on observed work and verification.

## Before Moving to the Next Unit

1. Verify the unit against the finalized rules and its user flow.
2. Check relevant architecture invariants.
3. Run the project's actual configured checks once they exist; no build command is currently available.
4. Record the result and remaining limitations in the progress tracker.

For initialization, verify all six files exist, use consistent scope and status, and contain no copied example values or unresolved instructional placeholders.
