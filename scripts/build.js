import {rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
// Remove only this repository's generated output so withdrawn recipes cannot survive a rebuild.
const output=fileURLToPath(new URL('../_site/',import.meta.url));
rmSync(output,{recursive:true,force:true});
execFileSync(process.execPath,['scripts/validate.js'],{stdio:'inherit'});
execFileSync(process.execPath,['node_modules/@11ty/eleventy/cmd.cjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-output.js'],{stdio:'inherit'});
