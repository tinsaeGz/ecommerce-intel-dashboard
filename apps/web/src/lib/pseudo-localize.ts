const substitutions: Record<string, string> = {
  A: "Å",
  E: "Ë",
  I: "Ï",
  O: "Ø",
  U: "Û",
  a: "å",
  e: "ë",
  i: "ï",
  o: "ø",
  u: "û",
};

export function pseudoLocalize(value: string) {
  const transformed = [...value]
    .map((character) => substitutions[character] ?? character)
    .join("");
  const expansion = "~".repeat(Math.ceil(value.length * 0.32));
  return `［${transformed}${expansion}］`;
}
