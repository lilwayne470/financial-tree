import { render } from 'react-dom';
import 'react-sortable-tree/style.css';
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';

import Table from './Table';


// -------------------------
// Create an drag source component that can be dragged into the tree
// https://react-dnd.github.io/react-dnd/docs-drag-source.html
// -------------------------
// This type must be assigned to the tree via the `dndType` prop as well
const externalNodeType = 'yourNodeType';
const externalNodeSpec = {
  // This needs to return an object with a property `node` in it.
  // Object rest spread is recommended to avoid side effects of
  // referencing the same object in different trees.
  beginDrag: componentProps => ({ node: { ...componentProps.node } }),
};
const externalNodeCollect = (connect /* , monitor */) => ({
  connectDragSource: connect.dragSource(),
  // Add props via react-dnd APIs to enable more visual
  // customization of your component
  // isDragging: monitor.isDragging(),
  // didDrop: monitor.didDrop(),
});


function externalNodeBaseComponent(props) {
    const { connectDragSource, node } = props;

    return connectDragSource(
      <div
        style={{
          display: 'inline-block',
          padding: '3px 5px',
          background: 'blue',
          color: 'white',
        }}
      >
        {node.title}
      </div>,
      { dropEffect: 'copy' }
    );
}

externalNodeBaseComponent.propTypes = {
  node: PropTypes.shape({ title: PropTypes.string }).isRequired,
  connectDragSource: PropTypes.func.isRequired,
};
const YourExternalNodeComponent = DragSource(
  externalNodeType,
  externalNodeSpec,
  externalNodeCollect
)(externalNodeBaseComponent);

class UnwrappedApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [{ title: 'CapEX' }, { title: 'OpEX' }],
      tableData: [
        ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
        ['2017', 10, 11, 12, 13, 15, 16],
        ['2018', 10, 11, 12, 13, 15, 16],
        ['2019', 10, 11, 12, 13, 15, 16],
        ['2020', 10, 11, 12, 13, 15, 16],
        ['2021', 10, 11, 12, 13, 15, 16]
      ],
    };
  }


  render() {
    return (
      <div style={{display:'flex'}}>
        <div style={{ height: 300, width: '30%' }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            dndType={externalNodeType}
          />
        </div>
        <div>
          <Table />
        </div>
      </div>
    );
  }
}

const App = DragDropContext(HTML5Backend)(UnwrappedApp);
export default App;

render(<App />, document.getElementById('root'));