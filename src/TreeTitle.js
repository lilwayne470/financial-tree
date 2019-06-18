import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import EditableText from "./EditableText";
import { withStyles } from '@material-ui/core/styles';


const styles = () => ({
    wrapper: {
        width: '100%', 
        position: 'relative'
    },
    checkBox: {
        position:'absolute', 
        left: -15, 
        top: -12
    },
  });



function TreeTitle ({node, path, commitName, classes}) {
    const { title:name, parameters } = node;

    const [ selected, setSelected ] = useState(parameters.active.param_value);
    const [ showCheckBox, setShowCheckBox ] = useState(true);

    const toggleSelection = () => {
        setSelected(!selected);
    }

    return (
        <div className={classes.wrapper}>
            {showCheckBox && <Checkbox
                checked={selected}
                onChange={toggleSelection}
                className={classes.checkBox}
            />}
            <EditableText
                value={name}
                setShowCheckBox={setShowCheckBox}
                onCommit={name => commitName(name, node, path)}
            />
        </div>
    )

}

export default withStyles(styles)(TreeTitle)