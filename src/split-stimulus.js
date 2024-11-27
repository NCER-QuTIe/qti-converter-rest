export function splitStimulus(stimulus) {
  let stack = [];
  let start = -1;
  let end = -1;
  let sep_start = -1;
  let sep_end = -1;
  for (let i = 1; i < stimulus.length; i++) {
    if (stimulus[i - 1] == "<" && stimulus[i] != "/") {
      stack.push(i - 2);
    }
    let c2 = stimulus[i - 1] + stimulus[i];
    if (c2 == "</" || c2 == "/>") {
      let tail = stack.pop();
      if (start === tail) {
        end = i - 1;
      }
      if (sep_start === tail) {
        sep_end = i - 1;
      }
    }
    if (c2 == "~~") {
      start = stack[stack.length - 3];
      sep_start = stack[stack.length - 2];
    }
  }

  if (start < 0 || sep_start < 0 || sep_end < 0 || end < 0) {
    throw new Error("No separator found");
  }

  console.log(start, sep_start, sep_end, end);
  while (stimulus[start] !== ">") {
    start++;
  }
  start++;

  while (stimulus[sep_end] !== ">") {
    sep_end++;
  }
  sep_end++;

  return (
    stimulus.slice(0, start) +
    '\n<div class="columns"><div>\n' +
    stimulus.slice(start, sep_start) +
    "\n</div><div>\n" +
    stimulus.slice(sep_end, end) +
    "\n</div></div>\n" +
    stimulus.slice(end)
  );
}
