import * as migration_20261103_111926_initial from './20261103_111926_initial';

export const migrations = [
  {
    up: migration_20261103_111926_initial.up,
    down: migration_20261103_111926_initial.down,
    name: '20261103_111926_initial'
  },
];
