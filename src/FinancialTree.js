import 'react-sortable-tree/style.css';
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { 
    SortableTreeWithoutDndContext as SortableTree,
    getTreeFromFlatData, 
    changeNodeAtPath, 
    removeNodeAtPath,
    addNodeUnderParent
  } from 'react-sortable-tree';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';


import TreeTitle from './TreeTitle';
import Table from './Table';
import { getRawData } from './data/FinancialData';
import TreeFilterBar from './TreeFilterBar';




const externalNodeType = 'yourNodeType';

const getTreeData = () => {
  return getTreeFromFlatData({
    flatData: getRawData().map(node => ({ ...node, title: node.parameters.name.param_value })),
    getKey: node => node.eid, 
    getParentKey: node => node.parameters.parent.param_value, 
    rootKey: null, 
  })
}


function FinancialTree(props) {

    const [state, setState] = useState(null);
    

    useEffect(() => {
      const InitialTreeData = getTreeData();
      setState({treeData: InitialTreeData})
    }, []);

    const getNodeKey = ({ node }) => node.eid;

    const commitName = (title, node, path) => {

        setState(state => ({
          treeData: changeNodeAtPath({
            treeData: state.treeData,
            path,
            getNodeKey,
            newNode: { ...node, title, parameters:{ ...node.parameters, name: {param_value: title}} },
          }),
        }));
    }

    const generatedNodeProps = (params) => {
      const { path } = params;
      return {
        title: <TreeTitle commitName={commitName} {...params} />,
        buttons: [
          <IconButton 
            aria-label="Add" 
            onClick={() =>
              setState(state => ({
                treeData: addNodeUnderParent({
                  treeData: state.treeData,
                  parentKey: path[path.length - 1],
                  expandParent: true,
                  getNodeKey,
                  newNode: {
                    title: `New Financial cat`,
                  },
                }).treeData,
              }))
            }
          >
            <AddIcon fontSize="small" />
          </IconButton>,
          <IconButton 
            aria-label="Delete" 
            onClick={() =>
              setState(state => ({
                treeData: removeNodeAtPath({
                  treeData: state.treeData,
                  path,
                  getNodeKey,
                }),
              }))
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ]
      }
    }

    return (
      <div style={{display:'flex'}}>
        <div style={{ height: 300, width: '30%' }}>
            {state && <TreeFilterBar treeData={state.treeData} setState={setState}/>}
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

