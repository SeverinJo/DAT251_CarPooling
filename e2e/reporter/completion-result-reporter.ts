import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

class completionResultReporter implements Reporter{
    async onEnd(result: FullResult) {
        const {stdout, stderr} = await execFileP("npm", [
            "run",
            "--silent",
            "--prefix=./scripts",
            "story:getComp",
        ]);

        if (stderr?.trim()) console.error(stderr);

        const report = stdout.trimEnd();
        console.log(report);
    }
}

export default completionResultReporter;