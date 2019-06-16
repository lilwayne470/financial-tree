import { render } from 'react-dom';
import 'react-sortable-tree/style.css';
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree, getTreeFromFlatData, changeNodeAtPath } from 'react-sortable-tree';
import TreeTitle from './TreeTitle'

import Table from './Table';
import { getRawData } from './data/FinancialData'



const externalNodeType = 'yourNodeType';

const getTreeData = () => {
  return getTreeFromFlatData({
    flatData: getRawData().map(node => ({ ...node, title: node.parameters.name.param_value })),
    getKey: node => node.eid, // resolve a node's key
    getParentKey: node => node.parameters.parent.param_value, // resolve a node's parent's key
    rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
  })
}


function FinancialTree(props) {

    const [state, setState] = useState(null);
    

    useEffect(() => {
      const InitialTreeData = getTreeData();
      setState({treeData: InitialTreeData})
    }, []);

    const commitName = (name, node, path, nodeKey) => {
      () => {
        setState(state => ({
          treeData: changeNodeAtPath({
            treeData: state.treeData,
            path,
            nodeKey,
            newNode: { ...node, name },
          }),
        }));
      }
    }

    const generatedNodeProps = ({ node, path }) => {
      console.log(node, path, node.eid);
      return {
        title: <TreeTitle commitName={commitName} node={node} path={path} />,
      }
    }

    return (
      <div style={{display:'flex'}}>
        <div style={{ height: 300, width: '30%' }}>
          {state &&
          <SortableTree
            treeData={state.treeData}
            onChange={treeData => setState({ treeData })}
            getNodeKey={({ node }) => node.eid}
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