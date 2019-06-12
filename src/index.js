import { render } from 'react-dom';
import 'react-sortable-tree/style.css';
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree, getTreeFromFlatData } from 'react-sortable-tree';
import TreeTitle from './TreeTitle'

import Table from './Table';



const externalNodeType = 'yourNodeType';

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

const getTreeData = () => {
  return getTreeFromFlatData({
    flatData: apiData.map(node => ({ ...node, title: node.name })),
    getKey: node => node.id, // resolve a node's key
    getParentKey: node => node.parent, // resolve a node's parent's key
    rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
  })
}

const generatedNodeProps = node => {
  console.log(node);
  return {
    title: <TreeTitle name={node.node.name} />,
  }
}

function FinancialTree(props) {

    const [state, setState] = useState(null);
    

    useEffect(() => {
      const InitialTreeData = getTreeData();
      setState({treeData: InitialTreeData})
    }, []);

    return (
      <div style={{display:'flex'}}>
        <div style={{ height: 300, width: '30%' }}>
          {state &&
          <SortableTree
            treeData={state.treeData}
            onChange={treeData => setState({ treeData })}
            generateNodeProps = {generatedNodeProps}
            dndType={externalNodeType}
          />}
        </div>
        <div>
          <Table />
        </div>
      </div>
    );
}

const App = DragDropContext(HTML5Backend)(FinancialTree);
export default App;

render(<App />, document.getElementById('root'));