import { Tree } from '@nrwl/devkit';
import { buildMatrix, normalizeOptions } from './build-matrix';

export default async function (tree: Tree) {
  const { projects } = normalizeOptions();

  if (projects?.length) {
    const matrix = buildMatrix(projects, tree);

    const json = JSON.stringify(matrix);
    const command = `echo '##vso[task.setvariable variable=matrix;isOutput=true]${json}'`;

    process.stdout.write(`${command}\n`);
  } else {
    console.error('No affected projects');
  }
}
