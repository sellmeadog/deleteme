import { joinPathFragments, names, Tree, writeJsonFile } from '@nrwl/devkit';
import { buildMatrix, normalizeOptions } from '../ado-matrix/build-matrix';

export interface NormalizedGeneratorSchema {
  projects: string[];
}

export default async function (tree: Tree) {
  const { projects } = normalizeOptions();

  if (projects?.length) {
    // const matrix = buildMatrix(projects, tree);
    // const parameters = Object.entries(matrix).reduce(
    //   (params, [key, value]) =>
    //     Object.entries(value).reduce(
    //       (params_, [subKey, subValue]) => ({
    //         ...params_,
    //         [formatKey(key, subKey)]: subValue,
    //       }),
    //       { ...params, [key]: true }
    //     ),
    //   {}
    // );

    const parameters = projects.reduce(
      (params, project) => ({ ...params, [project]: true }),
      {}
    );

    writeJsonFile(
      joinPathFragments('tmp', 'continue-parameters.json'),
      parameters
    );
  } else {
    console.error('No affectred projects.');
  }
}

function formatKey(key: string, subKey: string) {
  return names(`${key}-${subKey}`).fileName;
}
