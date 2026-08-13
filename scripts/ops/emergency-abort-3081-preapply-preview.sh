#!/usr/bin/env bash
set -euo pipefail

pidfile=/home/ubuntu/huaipet-project/safety-backups/release-3081-atomic-run-v2.pid
log=/home/ubuntu/huaipet-project/safety-backups/release-3081-atomic-run-v2.log
lock=/home/ubuntu/huaipet-project/huaipet-server/data/safety-backups/release-locks/release-3.0.81-ocean-vote-identity-20260813.lock
db=/home/ubuntu/huaipet-project/huaipet-server/data/huaipet-server.sqlite
current=/var/www/zhichao-web/current
previous=/var/www/zhichao-web/previous
old_current=/var/www/zhichao-web/releases/86aaa32-contributor-20260813T020709Z
old_previous=/var/www/zhichao-web/releases/a2a909e-3.0.79-20260813T021500CST

test -f "$pidfile"
parent="$(cat "$pidfile")"
[[ "$parent" =~ ^[1-9][0-9]*$ ]]

if ! kill -0 "$parent" 2>/dev/null; then
  echo ATOMIC_ALREADY_EXITED=1
  tail -n 80 "$log" || true
  exit 20
fi

parent_cmd="$(tr '\0' ' ' <"/proc/$parent/cmdline")"
[[ "$parent_cmd" == "bash /tmp/release-3081-atomic-web-and-publish-v2.sh " ]]

# Freeze the known parent before its preview can advance into the unique apply.
kill -STOP "$parent"
echo ATOMIC_PARENT_FROZEN="$parent"

resume_parent_on_exit=1
resume_parent() {
  if ((resume_parent_on_exit == 1)); then
    kill -CONT "$parent" 2>/dev/null || true
  fi
}
trap resume_parent EXIT

mapfile -t children < <(pgrep -P "$parent" || true)
if ((${#children[@]} > 1)); then
  echo UNEXPECTED_CHILD_COUNT="${#children[@]}"
  exit 30
fi

child="${children[0]:-}"
child_cmd=""
if [[ -n "$child" ]]; then
  child_cmd="$(tr '\0' ' ' <"/proc/$child/cmdline")"
  echo CHILD_PID="$child"
  echo CHILD_CMD="$child_cmd"
fi

# A durable publisher lock or --apply means the outcome is uncertain. Never
# kill or retry in that state; let the original atomic chain keep ownership.
if [[ -e "$lock" || "$child_cmd" == *"--apply"* ]]; then
  echo APPLY_STATE_UNCERTAIN=1
  kill -CONT "$parent"
  resume_parent_on_exit=0
  trap - EXIT
  exit 40
fi

if [[ -n "$child" ]]; then
  [[ "$child_cmd" == node\ /tmp/release-3081-publisher.*/scripts/ops/publish-release-3.0.81.mjs\  ]]
  kill -STOP "$child" 2>/dev/null || true
fi

audit="$({ DB_PATH="$db" node --input-type=module <<'NODE'
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.env.DB_PATH, { readOnly: true });
db.exec("PRAGMA query_only=ON");
const raw = db.prepare("SELECT value FROM app_settings WHERE key='app_release_config'").get()?.value;
const release = raw ? JSON.parse(String(raw)) : null;
db.close();
console.log(`CURRENT_VERSION=${release?.latestVersion ?? ""}`);
console.log(`CURRENT_NOTICE_ID=${release?.noticeId ?? ""}`);
NODE
} 2>&1)"
printf '%s\n' "$audit"
version="$(printf '%s\n' "$audit" | awk -F= '$1=="CURRENT_VERSION"{print $2}')"
notice="$(printf '%s\n' "$audit" | awk -F= '$1=="CURRENT_NOTICE_ID"{print $2}')"
[[ "$version" == 3.0.80 \
  && "$notice" == release-3.0.80-bookkeeping-editor-repair-20260813 \
  && ! -e "$lock" ]]

echo SAFE_PREAPPLY_ABORT=1
if [[ -n "$child" ]]; then
  kill -KILL "$child" 2>/dev/null || true
fi

# Resume only after the read-only child is killed. The original set -e EXIT
# trap then restores both web links because APPLY_STARTED is still zero.
kill -CONT "$parent"
resume_parent_on_exit=0
trap - EXIT

for _ in $(seq 1 180); do
  kill -0 "$parent" 2>/dev/null || break
  sleep 1
done
if kill -0 "$parent" 2>/dev/null; then
  echo ATOMIC_PARENT_DID_NOT_EXIT=1
  exit 50
fi

echo ATOMIC_PARENT_EXITED=1
tail -n 100 "$log" || true
[[ "$(readlink -f "$current")" == "$old_current" ]]
[[ "$(readlink -f "$previous")" == "$old_previous" ]]
[[ ! -e "$lock" ]]
echo WEB_LINKS_ROLLED_BACK=1
curl -fsS --connect-timeout 10 --max-time 30 http://127.0.0.1:4310/health
echo LOCAL_HEALTH_RESTORED=1
