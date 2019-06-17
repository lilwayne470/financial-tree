const apiData = [
    { id: '1', name: 'Capital expenditures (capex)', parent: null },
    { id: '2', name: 'Operational expenditures (opex)', parent: null },
    { id: '3', name: 'Revenues', parent: null },
    { id: '4', name: 'Infrastructure', parent: 1 },
    { id: '5', name: 'Equipment', parent: 1 },
    { id: '6', name: 'Processing cost', parent: 2 },
    { id: '7', name: 'Mining cost', parent: 2 },
    { id: '8', name: 'Transportation costs', parent: 2 },
    { id: '9', name: 'Mining cost', parent: 2 },
  ];

export const getNodeTemplate = row => ({
    eid: row.id,
    type: "FinancialCategory",
    parameters: {
        active: {
            param_value: true
        },
        code: {
            param_value: row.name.toUpperCase(),
        },
        name: {
            param_value: row.name
        },
        parent: {
            param_value: row.parent
        }
    },
    class: "Soft"
});

export const getRawData = () => {
   return apiData.map( row => getNodeTemplate(row));
}