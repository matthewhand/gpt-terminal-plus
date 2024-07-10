const { execSync } = require('child_process');

try {
  // Execute the shell script and read its JSON output
  const output = execSync('../scripts/gatherInfo.sh').toString();
  const systemInfo = JSON.parse(output);
  console.log(systemInfo);
} catch (error) {
  console.error('Failed to read system info:', error);
}
