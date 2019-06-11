import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DragDropContext, DragSource } from 'react-dnd';
import { findDOMNode } from 'react-dom';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(title, calories, fat, carbs, protein) {
  id += 1;
  return { id, title, calories, fat, carbs, protein };
}

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

    return (
        <TableRow key={node.id} ref={instance => connectDragSource(findDOMNode(instance), { dropEffect: 'copy' })}>
            <TableCell component="th" scope="row">
            {node.title}
            </TableCell>
            <TableCell align="right">{node.calories}</TableCell>
            <TableCell align="right">{node.fat}</TableCell>
            <TableCell align="right">{node.carbs}</TableCell>
            <TableCell align="right">{node.protein}</TableCell>
        </TableRow>
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

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function SimpleTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat (g)</TableCell>
            <TableCell align="right">Carbs (g)</TableCell>
            <TableCell align="right">Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <YourExternalNodeComponent node={row} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
