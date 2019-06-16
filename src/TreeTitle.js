import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import EditableText from "./EditableText";


export default function TreeTitle ({node, path, commitName}) {
    const { title:name } = node;

    const [ selected, setSelected ] = useState(false);
    const [ showCheckBox, setShowCheckBox ] = useState(true);
    return (
        <div style={{width: '100%', position: 'relative'}}>
            {showCheckBox && <Checkbox
                checked={selected}
                onChange={() =>setSelected(!selected)}
                style={{position:'absolute', left: -15, top: -12}}
            />}
            <EditableText
                value={name}
                setShowCheckBox={setShowCheckBox}
                onCommit={name => commitName(name, node, path, node.eid)}
            />
        </div>
    )

}