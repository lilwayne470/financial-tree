import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { toggleExpandedForAll, getFlatDataFromTree } from 'react-sortable-tree';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { getNodeTemplate } from './data/FinancialData';
import { getNodeKey } from './FinancialTree';

const styles = theme => ({
    paper: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 300,
      height: 30,
    },
    button: {
      margin: theme.spacing.unit,
    },
    input: {
      marginLeft: 8,
      flex: 1,
    },
    iconButton: {
      padding: 3,
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4,
    },
    chip: {
      margin: theme.spacing.unit,
    },
  });

  export const searchInit = {
    searchString: '',
    searchFocusIndex: 0,
    searchFoundCount: null,
  }

const getNextId = (params) => {
  const { treeData } = params;
  const flattenTreeData = getFlatDataFromTree({
    treeData,
    getNodeKey,
    ignoreCollapsed :false
  });
  const IDsList = flattenTreeData.map(({node}) => (+node.eid));
  return (Math.max(...IDsList) + 1);
}

function TreeFilterBar(props) {
    const { treeData, setState, classes, searchState, setSearchState } = props;

    const { searchString, searchFocusIndex, searchFoundCount } = searchState;


    const selectPrevMatch = () =>
      setSearchState({
          ...searchState,
          searchFocusIndex:
            searchFocusIndex !== null
              ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
              : searchFoundCount - 1,
        });

    const selectNextMatch = () =>
    setSearchState({
        ...searchState,
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    const addCategory = () => {
      const title = `New Financial cat`;
      const parent = null;
      const id = getNextId({treeData});
      const node = getNodeTemplate({name:title, parent, id });
      
      setState(() => ({
          treeData: treeData.concat({
            title, ...node
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
            <Paper className={classes.paper}>
              <InputBase 
                className={classes.input} 
                placeholder="Search" 
                value={searchString} 
                onChange={event => setSearchState({...searchState, searchString: event.target.value })}
              />
              <IconButton className={classes.iconButton} aria-label="Search">
                <SearchIcon />
              </IconButton>
              <Divider className={classes.divider} />
              <IconButton 
                className={classes.iconButton} 
                disabled={!searchFoundCount}
                onClick={selectPrevMatch} 
                aria-label="Directions"
              >
                <KeyboardArrowLeft />
              </IconButton>
              <IconButton 
                className={classes.iconButton} 
                disabled={!searchFoundCount}
                onClick={selectNextMatch}
                aria-label="Directions"
              >
                <KeyboardArrowRight />
              </IconButton>
              <Chip label={`${searchFoundCount > 0 ? searchFocusIndex + 1 : 0} / ${searchFoundCount || 0}`} className={classes.chip} variant="outlined" />
            </Paper>
        </div>
    )
}

TreeFilterBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(TreeFilterBar)
