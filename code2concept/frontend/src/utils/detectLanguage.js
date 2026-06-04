export function detectLanguage(code) {
  if (!code || !code.trim()) return 'plaintext';
  const c = code.trim();

  if (/^\s*(import|from)\s+\w/.test(c) && /def |class |:\s*$|print\(/.test(c)) return 'python';
  if (/def \w+\(|class \w+:|import \w+|from \w+ import|\.append\(|\.split\(/.test(c)) return 'python';
  if (/function\s+\w+\s*\(|const |let |var |=>|console\.log|require\(/.test(c)) return 'javascript';
  if (/public\s+(static\s+)?void|System\.out\.print|import java\./.test(c)) return 'java';
  if (/#include|std::|cout|cin|int main\(/.test(c)) return 'c++';
  if (/using System|Console\.Write|namespace |\.cs/.test(c)) return 'c#';
  if (/func \w+\(|fmt\.Print|package main/.test(c)) return 'go';
  if (/fn \w+\(|println!|let mut |use std::/.test(c)) return 'rust';
  if (/SELECT|INSERT|UPDATE|DELETE|FROM|WHERE/i.test(c) && !/def |function/.test(c)) return 'sql';
  if (/^\s*<[a-zA-Z]/.test(c) || /<\/\w+>/.test(c)) return 'html';
  if (/\{[\s\S]*:\s*[\s\S]*\}/.test(c) && !/{/.test(c.replace(/\{[^{}]*\}/g,''))) return 'css';
  if (/^[\s\S]*def |^[\s\S]*class /.test(c)) return 'python';
  return 'plaintext';
}
