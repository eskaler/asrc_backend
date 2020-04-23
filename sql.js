module.exports = {
  objectsAll: `
    select table_name as tableName, description 
    from 
    (
      SELECT relname, obj_description(oid) as description
      FROM pg_class
      WHERE relkind = 'r'
    ) pgc
    inner join 
    (
      SELECT table_name
        FROM information_schema.tables 
      WHERE table_schema='public'
        AND table_type='BASE TABLE'
    ) ist
    on ist.table_name = pgc.relname;`,
  objectDescription: `
    SELECT c.table_name as tablename, c.column_name as columnname, c.data_type as datatype, pgd.description
    FROM pg_catalog.pg_statio_all_tables as st
    inner join pg_catalog.pg_description pgd on (pgd.objoid=st.relid)
    right join information_schema.columns c on (pgd.objsubid=c.ordinal_position
      and  c.table_schema=st.schemaname and c.table_name=st.relname)
      where c.table_name = $1;`,
  objectData:`SELECT * from "$1";`
}