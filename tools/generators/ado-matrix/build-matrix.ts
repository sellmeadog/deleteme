import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { readFileSync } from 'fs';

export interface NormalizedGeneratorSchema {
  projects?: string[];
}

export interface BuildMatrix {
  [key: string]: BuildParameters;
}

export interface BuildParameters {
  [key: string]: unknown;
}

export function buildMatrix(projects: string[], tree: Tree): BuildMatrix {
  return projects
    .filter((name) => name && !name.includes('-e2e'))
    .map((name) => readProjectConfiguration(tree, name))
    .reduce((acc, { name, root, targets }) => {
      const hasBundleIosTarget = targets?.['bundle-ios'];
      const hasExportTarget = targets?.['export'];
      const target = hasBundleIosTarget
        ? 'bundle-ios'
        : hasExportTarget
        ? 'export'
        : 'build';

      return {
        ...acc,
        [name!]: {
          buildArtifactName: name?.replace(/-/gi, '_'),
          buildCommand: `npx nx run ${name}:${target}`,
          buildTagCommand: `npx nx run ${name}:add-build-tag`,
          image: hasBundleIosTarget ? 'macos-latest' : 'ubuntu-latest',
          name,
          root,
        },
      };
    }, {});
}

export function normalizeOptions(): NormalizedGeneratorSchema {
  const stdin = readFileSync(0, 'utf-8').trim();

  return {
    projects: stdin ? stdin.split(',').map((value) => value.trim()) : undefined,
  };
}
