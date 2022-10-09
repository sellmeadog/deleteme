import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { readFileSync } from 'fs';

interface NormalizedGeneratorSchema {
  projects: string[];
}

export default async function (tree: Tree) {
  const { projects } = normalizeOptions();
  const matrix = projects
    .filter((name) => !name.includes('-e2e'))
    .map((name) => readProjectConfiguration(tree, name))
    .reduce((acc, { name, root, targets }) => {
      const bundleIosTarget = targets?.['bundle-ios'];
      const exportTarget = targets?.['export'];
      const target = bundleIosTarget
        ? 'bundle-ios'
        : exportTarget
        ? 'export'
        : 'build';

      return {
        ...acc,
        [name!]: {
          buildArtifactName: name?.replace(/-/gi, '_'),
          buildCommand: `npx nx run ${name}:${target}`,
          buildTagCommand: `npx nx run ${name}:add-build-tag`,
          image: bundleIosTarget ? 'macos-latest' : 'ubuntu-latest',
          name,
          root,
        },
      };
    }, {});

  const json = JSON.stringify(matrix);
  const command = `echo '##vso[task.setvariable variable=matrix;isOutput=true]${json}'`;

  process.stdout.write(`${command}\n`);
}

function normalizeOptions(): NormalizedGeneratorSchema {
  return {
    projects: readFileSync(0, 'utf-8')
      .split(',')
      .map((value) => value.trim()),
  };
}
