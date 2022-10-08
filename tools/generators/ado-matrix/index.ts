import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

interface NormalizedGeneratorSchema {
  projects: string[];
}

export default async function (tree: Tree) {
  const { projects } = normalizeOptions();
  const matrix = projects
    .filter((name) => name.includes('-e2e'))
    .map((name) => readProjectConfiguration(tree, name))
    .reduce((acc, { name, root, sourceRoot, targets }) => {
      const macos = targets?.['run-ios'];

      return {
        ...acc,
        [name!]: {
          command: `npx nx run ${name}:build`,
          image: macos ? 'macos-latest' : 'ubuntu-latest',
          sourceRoot: macos ? `${root}/ios` : sourceRoot,
        },
      };
    }, {});

  const json = JSON.stringify(matrix);
  const command = `echo '##vso[task.setvariable variable=matrix;isOutput=true]${json}'`;

  process.stdout.write(`${command}\n`);
  execSync(command);
}

function normalizeOptions(): NormalizedGeneratorSchema {
  return {
    projects: readFileSync(0, 'utf-8')
      .split(',')
      .map((value) => value.trim()),
  };
}
