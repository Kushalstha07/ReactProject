import React from "react";
import DataTable from "react-data-table-component";

const data = [
  { id: 1, name: "Ram", age: 24 },
  { id: 2, name: "Sita", age: 28 },
  { id: 3, name: "Hari", age: 22 },
];

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Age",
    selector: (row) => row.age,
    sortable: true,
  },
];

function DataTableExample() {
  return (
    <DataTable
      title="My Table"
      columns={columns}
      data={data}
      pagination
    />
  );
}

export default DataTableExample;
