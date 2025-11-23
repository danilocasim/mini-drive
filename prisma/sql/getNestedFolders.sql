-- @param {Int} $1:folderid

WITH RECURSIVE subordinates AS (
  SELECT
    id,
    name,
    parentid
  FROM
    "Folder"
  WHERE
    id = $1
  UNION
  SELECT
    e.id,
    e.name,
    e.parentid
  FROM
    "Folder" e
    INNER JOIN subordinates s ON s.id = e.parentid
)
SELECT * FROM subordinates;