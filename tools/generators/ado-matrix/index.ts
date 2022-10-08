import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { readFileSync } from 'fs';

interface NormalizedGeneratorSchema {
  projects: string[];
}

export default async function (tree: Tree) {
  const { projects } = normalizeOptions();
  const matrix = projects
    .map((name) => readProjectConfiguration(tree, name))
    .reduce((acc, { name, root, sourceRoot, targets }) => {
      const macos = targets?.['run-ios'];

      return {
        ...acc,
        [name!]: {
          image: macos ? 'macos-latest' : 'ubuntu-latest',
          sourceRoot: macos ? `${root}/ios` : sourceRoot,
        },
      };
    }, {});

  const matrixJson = JSON.stringify(matrix);

  process.stdout.write(
    `##vso[task.setvariable variable=matrix;isOutput=true]${matrixJson}\n`
  );
}

function normalizeOptions(): NormalizedGeneratorSchema {
  return {
    projects: readFileSync(0, 'utf-8')
      .split(',')
      .map((value) => value.trim()),
  };
}
