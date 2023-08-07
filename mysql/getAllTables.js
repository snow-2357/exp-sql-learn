const connection = require("../mysql");
const fs = require("fs");

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  const query = `
    SELECT TABLE_NAME
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = 'records';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching table names:", error);
      connection.end();
      return;
    }

    const tableSchemas = [];

    results.forEach((row) => {
      const tableName = row.TABLE_NAME;
      const schemaQuery = `
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = 'records' AND TABLE_NAME = ?;
      `;

      connection.query(
        schemaQuery,
        [tableName],
        (schemaError, schemaResults) => {
          if (schemaError) {
            console.error(
              `Error fetching schema for table ${tableName}:`,
              schemaError
            );
          } else {
            tableSchemas.push({ table: tableName, schema: schemaResults });
          }

          if (tableSchemas.length === results.length) {
            const schemaFilePath = "./mysql/table_schemas.json";
            fs.writeFile(
              schemaFilePath,
              JSON.stringify(tableSchemas, null, 2),
              (err) => {
                if (err) {
                  console.error("Error writing schema file:", err);
                } else {
                  console.log("All table schemas saved to:", schemaFilePath);
                }

                connection.end();
              }
            );
          }
        }
      );
    });
  });
});
