#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

next_dir="${SITES_PROJECT_ROOT}/.next"

[[ -d "${next_dir}" ]] || {
  echo "Missing .next directory after build" >&2
  exit 66
}

echo "Validated Next.js artifact: .next directory is present."
