import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import EditableText from "./EditableText";
import withStyles from '@material-ui/core/styles/withStyles';


export default function TreeTitle ({name}) {
    return (
        <div style={{width: '100%', position: 'relative'}}>
            <Checkbox
                checked={false}
                onChange={e => console.log(e)}
                style={{position:'absolute', left: -15, top: -12}}
            />
            <EditableText
                value={name}
                onCommit={name => console.log(name)}
            />
        </div>
    )

}