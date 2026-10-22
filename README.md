# Aeris — Continuous HR Compliance
<img width="2281" height="1654" alt="image" src="https://github.com/user-attachments/assets/7a085fa3-0d6e-4296-bf7c-a4c43db113e5" />

A runnable, English-only prototype that checks every supplied HR transaction against approved policy rules, explains exceptions with evidence, and routes them for human review.

**Submission data disclosure:** The organiser data pack was not available before our submission preparation. This submission uses generated synthetic data and illustrative policies only. No results are presented as official test-file findings or hidden-test accuracy.

## Run locally

Requires **Node.js 20 or later**. No package installation, API key, cloud account or internet connection is needed to run the product.

```sh
git clone https://github.com/Neuragreen/Continuous-HR-Compliance-Challenge.git
cd Continuous-HR-Compliance-Challenge
npm start
```

Open **http://127.0.0.1:4187**. If the port is busy, run `PORT=4190 npm start` on macOS/Linux or set the `PORT` environment variable in your shell. Stop the server with Ctrl+C. Use a fresh browser profile for an untouched demonstration.

The first run generates **10,000 transactions**, **2,000 employees**, six HR processes and **16 illustrative policies**. Default results are **603 policy exceptions** and **145 missing-evidence checks**. These are findings, not distinct employee or transaction counts.

## Suggested judge walkthrough

1. **Overview:** inspect coverage, exception counts and prioritised queue.
2. **Exceptions:** open a finding; inspect policy ID/version, data evidence, severity, named demo owner and corrective action.
3. Switch **Review context** to Operations owner, submit fix evidence, then switch back to Compliance analyst to verify closure. No employee transaction changes.
4. **Policy library → Create a rule:** enter `Every hire requires a Passport attachment.` Interpret and preview it; human approval is required for activation. Unsupported wording is surfaced.
5. **Insights:** combine process, team and policy filters to inspect monthly trends and relevant denominators.
6. **Batch history:** revisit retained datasets, use synthetic replay, and export/restore a workspace backup.
7. **Investigation leads:** generate the labelled unusual example; detector evidence is separate from policy violations.
8. **Audit trail / Export findings:** inspect decisions and export evidence. An optional CSV finding template supports confirmed column mapping.

## Submission materials

- [Known issues and limitations](KNOWN_ISSUES.md)
- [Responsible AI and data handling](RESPONSIBLE_AI.md)
- [Two-page solution note](deliverables/aeris-solution-note.pdf)
- [Synthetic policy exceptions](deliverables/DEMO-ONLY-policy-exceptions.csv)
- [Synthetic missing-evidence checks](deliverables/DEMO-ONLY-evidence-gaps.csv)
- [Demo video](demo-video/demo.mp4) (also available at http://127.0.0.1:4187/demo.mp4 while the local app is running).

The finding CSVs use our prototype schema, not an unavailable organiser format. Missing evidence and statistical investigation leads are not claimed as confirmed policy violations.

## Verify and reproduce

```sh
npm test
npm run check
node cli.mjs --demo --out output
```

The test suite contains 36 automated checks. CLI execution writes findings and complete audit evidence to ignored `output/`. It uses the same deterministic engine as the interface. For external synthetic files:

```sh
node cli.mjs --transactions transactions.csv --employees employees.csv --rules approved-rules.json --out output
```

The CLI accepts structured JSON rules or Markdown containing a fenced JSON rule array. Use the browser's human-reviewed policy drafting workflow for plain prose.

## Input conventions

Transaction CSVs require unique `transaction_id`, `employee_id`, `type`, `effective_date`. Types: `Hire`, `Pay change`, `Allowance`, `Transfer`, `Leave`, `Exit`. Policy evidence uses `grade`, `department`, `amount`, `requester`, `approver`, `approver_role`, `submitted_at`, `approved_at`, `documents`. Employees require unique `employee_id`; other attributes enrich records. Dates use ISO format; document names are semicolon-separated. Download example files from the interface.

## Local storage and architecture

Imported files, custom policies and derived review records remain in IndexedDB on the device. They survive refresh; export a workspace backup before clearing browser storage. Generated-demo-only state can also use the local server's ignored `.local-data/` folder. Imported workspaces are rejected by the synchronization API.

`dist/` contains the browser interface and reusable checking engine; `server.mjs` serves the local product; `cli.mjs` runs offline batches; `tests/` contains verification; `worker/` and `scripts/build.mjs` retain optional private hosting support. `npm run build` prepares that Worker but is not needed to run locally.

The shared hosted link is an earlier release. **Use this repository for the final submission review.** Rehearsal scripts, old recordings, temporary files and local state are excluded from the current Git tree. Earlier Git history may retain previously committed files.
