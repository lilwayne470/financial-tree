import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { toggleExpandedForAll } from 'react-sortable-tree';

import { getNodeTemplate } from './data/FinancialData'

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    input: {
      display: 'none',
    },
  });

function TreeFilterBar(props) {
    const { treeData, setState, classes } = props;

    const addCategory = () => {
        setState(() => ({
            treeData: treeData.concat({
              title: `New Cat`,
            }),
        }))
    }

    const toggleNodeExpansion = expanded => {
        setState(prevState => ({
          treeData: toggleExpandedForAll({
            treeData: prevState.treeData,
            expanded,
          }),
        }));
    };

    return (
        <div className="wrapper">
            <Button color="primary" className={classes.button} onClick={addCategory}>
                Add
            </Button>
            <Button color="primary" className={classes.button} onClick={() => toggleNodeExpansion(true)}>
                Expand All
            </Button>
            <Button color="primary" className={classes.button} onClick={() => toggleNodeExpansion(false)}>
                Collapse All
            </Button>
        </div>
    )
}

TreeFilterBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(TreeFilterBar)
