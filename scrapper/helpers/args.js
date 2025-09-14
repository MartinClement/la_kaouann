const parseArgs = (process) => {
  const args = process.argv.slice(2); // skip node and script path
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    let arg = args[i];

    if (arg.startsWith('--')) {
      // Long flag: --key=value or --key value
      arg = arg.slice(2);
      if (arg.includes('=')) {
        const [key, value] = arg.split('=');
        parsed[key] = value;
      } else {
        const next = args[i + 1];
        if (next && !next.startsWith('-')) {
          parsed[arg] = next;
          i++; // skip next since it's consumed
        } else {
          parsed[arg] = true; // flag without value
        }
      }
    } else if (arg.startsWith('-')) {
      // Short flag: -a -b value
      const flags = arg.slice(1).split('');
      if (flags.length > 1) {
        flags.forEach(f => (parsed[f] = true)); // like -abc → {a:true,b:true,c:true}
      } else {
        const key = flags[0];
        const next = args[i + 1];
        if (next && !next.startsWith('-')) {
          parsed[key] = next;
          i++;
        } else {
          parsed[key] = true;
        }
      }
    } else {
      // Positional args
      if (!parsed._) parsed._ = [];
      parsed._.push(arg);
    }
  }

  return parsed;
}

export {
  parseArgs
}
