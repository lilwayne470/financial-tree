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
import CustomTheme from './theme';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';


import TreeTitle from './TreeTitle';
import Table from './Table';
import { getRawData } from './data/FinancialData';
import TreeFilterBar, { searchInit } from './TreeFilterBar';




const externalNodeType = 'yourNodeType';

export const getNodeKey = ({ node }) => node.eid;

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
    const [searchState, setSearchState] = useState(searchInit);

    const { searchString, searchFocusIndex, searchFoundCount } = searchState;
    
    useEffect(() => {
      const InitialTreeData = getTreeData();
      setState({treeData: InitialTreeData})
    }, []);


    const handleUpdate = (params) => {
      const {newNode, path} = params;
      setState(state => ({
        treeData: changeNodeAtPath({
          treeData: state.treeData,
          path,
          getNodeKey,
          newNode: newNode,
        }),
      }));
    }

    const handleDelete = (params) => {
      const {path} = params;
      setState(state => ({
        treeData: removeNodeAtPath({
          treeData: state.treeData,
          path,
          getNodeKey,
        }),
      }))
    }

    const handleCreate = (params) => {
      const {path} = params;
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

  const commitName = (title, node, path) => {
      const newNode = { ...node, title, parameters:{ ...node.parameters, name: {param_value: title}} };
      handleUpdate({newNode, path});
  }

    const generatedNodeProps = (params) => {
      const { path } = params;
      return {
        title: <TreeTitle commitName={commitName} {...params} />,
        buttons: [
          <IconButton 
            aria-label="Add" 
            onClick={() => handleCreate({path})}
          >
            <AddIcon fontSize="small" />
          </IconButton>,
          <IconButton 
            aria-label="Delete" 
            onClick={() => handleDelete({path})}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ]
      }
    }

    const customSearchMethod = ({ node, searchQuery }) =>
      searchQuery &&
      node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;


    const searchFinishCallBack = matches =>
            setSearchState({ ...searchState,
              searchFoundCount: matches.length,
              searchFocusIndex:
                matches.length > 0 ? searchFocusIndex % matches.length : 0,
            })

    return (
      <div style={{display:'flex'}}>
        <div style={{ height: 500, width: '30%' }}>
            {state && <TreeFilterBar treeData={state.treeData} {...{setState, searchState, setSearchState}} />}
          {state &&
          <SortableTree
          theme={CustomTheme}
            treeData={state.treeData}
            onChange={treeData => setState({ treeData })}
            getNodeKey={({ node }) => node.eid}
            generateNodeProps = {generatedNodeProps}
            searchMethod={customSearchMethod}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={searchFinishCallBack}
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

