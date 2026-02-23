/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(
    'requests',
    {
      name: { type: 'varchar(255)', notNull: true },
      email: { type: 'varchar(255)', notNull: true },
      message: { type: 'text', notNull: true },
    },
    { ifNotExists: true }
  );
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable('requests', { ifExists: true });
};
