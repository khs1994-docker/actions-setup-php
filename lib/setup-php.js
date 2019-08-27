const exec = require('@actions/exec');
const core = require('@actions/core');

const PHP_VERSION = core.getInput('php_version');
const ARGS = core.getInput('args');
// const RUNNER_WORKSPACE='/home/runner/work/php-demo'

const RUNNER_WORKSPACE = process.env.RUNNER_WORKSPACE;
const WORKSPACE = RUNNER_WORKSPACE.split('/').pop();

async function run() {
  await exec.exec('docker', [
    'container',
    'run',
    '--workdir', '/github/workspace',
    '--rm',
    '-v', '/home/runner/work/_temp/_github_home:/github/home',
    '-v', '/home/runner/work/_temp/_github_workflow:/github/workflow',
    '-v', `${RUNNER_WORKSPACE}/${WORKSPACE}:/github/workspace`,
    `khs1994/php:${PHP_VERSION}-fpm-alpine`,
    'bash','-c',ARGS,
  ]);
}

run().then(() => {
  console.log('Run success');
}).catch((e) => {
  console.log(e);
});
