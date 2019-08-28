const exec = require('@actions/exec');
const core = require('@actions/core');

const PHP_VERSION = core.getInput('php_version');
const ARGS = core.getInput('args');
// const RUNNER_WORKSPACE='/home/runner/work/php-demo'

const RUNNER_WORKSPACE = process.env.RUNNER_WORKSPACE;
const WORKSPACE = RUNNER_WORKSPACE.split('/').pop();

async function run() {
  await exec.exec('docker', [
    'network',
    'ls',
  ]);

  const NETWORK = await new Promise((resolve, reject) => {
    const systemExec = require('child_process').exec;
    const cmd = 'docker network ls | grep github | awk \'{print $2}\' | head -1';

    systemExec(cmd, function(error, stdout, stderr) {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      resolve(stdout || 'github_actions');
    });
  });

  await exec.exec('docker', [
    'container',
    'run',
    '--workdir', '/github/workspace',
    '--rm',
    '--network', NETWORK,
    '-v', '/home/runner/work/_temp/_github_home:/github/home',
    '-v', '/home/runner/work/_temp/_github_workflow:/github/workflow',
    '-v', `${RUNNER_WORKSPACE}/${WORKSPACE}:/github/workspace`,
    `khs1994/php:${PHP_VERSION}-fpm-alpine`,
    'bash', '-cex', ARGS,
  ]);
}

run().then(() => {
  console.log('Run success');
}).catch((e) => {
  core.setFailed(e.toString());
});
