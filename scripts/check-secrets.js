#!/usr/bin/env node
// Проверка безопасности перед пушем: ищет в уходящих коммитах IP-адреса, ключи, токены и запретные файлы.
// Вызывается из .githooks/pre-push (stdin — строки "<local ref> <local sha> <remote ref> <remote sha>").
// Без stdin (make check-secrets) проверяет все коммиты, которых ещё нет на remote.
// Строку можно пометить как безопасную комментарием "secrets-ok".
const { execFileSync } = require("child_process");
const fs = require("fs");

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const ZERO = /^0+$/;

const PATTERNS = [
  ["приватный ключ", /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/],
  ["GitHub-токен", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}/],
  ["ключ Anthropic/OpenAI", /\bsk-(?:ant-)?[A-Za-z0-9_-]{20,}/],
  ["ключ AWS", /\bAKIA[0-9A-Z]{16}\b/],
  ["токен Slack", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["ключ Google", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["токен Telegram-бота", /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/],
  ["пароль/секрет в коде", /(?:password|passwd|secret|api[_-]?key|token)\s*[:=]\s*["'][^"'\s]{8,}["']/i],
  ["IP-адрес", /\b(?!(?:127|10|0)\.)(?!192\.168\.)(?!172\.(?:1[6-9]|2\d|3[01])\.)(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/],
];
const FORBIDDEN_FILES = [/(^|\/)\.env(\..*)?$/, /\.pem$/, /\.key$/, /(^|\/)id_(rsa|ed25519|ecdsa)$/, /(^|\/)deploy\.local\.mk$/, /(^|\/)\.claude\/settings\.local\.json$/];

function ranges() {
  const input = process.stdin.isTTY ? "" : fs.readFileSync(0, "utf8");
  const lines = input.split("\n").map(l => l.trim().split(/\s+/)).filter(p => p.length === 4);
  if (!lines.length) return [["HEAD", "--not", "--remotes"]];
  return lines
    .filter(([, local]) => !ZERO.test(local)) // удаление ветки
    .map(([, local, , remote]) => (ZERO.test(remote) ? [local, "--not", "--remotes"] : [`${remote}..${local}`]));
}

const problems = [];
for (const range of ranges()) {
  const commits = git("rev-list", ...range).split("\n").filter(Boolean);
  for (const sha of commits) {
    const files = git("show", "--name-only", "--diff-filter=AM", "--format=", sha).split("\n").filter(Boolean);
    for (const f of files) if (FORBIDDEN_FILES.some(re => re.test(f))) problems.push(`${sha.slice(0, 7)} ${f}: такой файл нельзя коммитить`);

    let file = "";
    for (const line of git("show", "--format=", "--unified=0", "--no-color", sha).split("\n")) {
      if (line.startsWith("+++ ")) { file = line.slice(6); continue; }
      if (!line.startsWith("+") || line.includes("secrets-ok")) continue;
      for (const [name, re] of PATTERNS) {
        const m = line.match(re);
        if (m) problems.push(`${sha.slice(0, 7)} ${file}: ${name}: ${m[0].slice(0, 40)}`);
      }
    }
  }
}

if (problems.length) {
  console.error("\n✖ Проверка безопасности не пройдена:\n  " + [...new Set(problems)].join("\n  "));
  console.error("\nУбери это из коммитов (git commit --amend / rebase). Если это точно не секрет, добавь в строку комментарий secrets-ok.\n");
  process.exit(1);
}
console.log("✔ Секретов, IP и запретных файлов в уходящих коммитах нет");
