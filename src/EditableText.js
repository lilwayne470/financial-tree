import React from 'react';
import {unstable_batchedUpdates} from 'react-dom'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import Checkmark from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/ClearOutlined';
import { compose, pipe, makeHandlers, makeProps, makeState } from 'arranger';


const batch = unstable_batchedUpdates;
const isFunction = value => value && typeof value === 'function';

const truncate = (str, length = 30, ending = '...') =>
    str.length > length ? str.substring(0, length - ending.length) + ending : str;
const validate = (value, inputValue) => value !== inputValue && inputValue.length && inputValue.length <= 50;

const styles = theme => ({
    root: {
        width: '80%',
        whiteSpace: 'nowrap',
    },
    editableInput: {
        background: theme.palette.background.default,
        border: `1px solid ${theme.palette.border}`,
        borderRadius: '4px',
        padding: 3,
        paddingLeft: theme.spacing.unit,
        fontSize: 'inherit',
        textAlign: 'inherit',
        maxHeight: 25,
    },
    checkmark: {
        color: 'green',
    },
    name: {
        fontSize: theme.typography.subtitle1.fontSize,
        paddingLeft: 30,
        marginRight: 10,
        paddingRight: 30,
    },
    icnbutton: {
        position: 'absolute',
        right: -5,
        top: -10,
    },
    deleteConf: {
        top: 0,
    }
});

const useEnhancer = pipe(
    makeState('inputValue', 'setInputValue', props => props.value),
    makeState('isEditing', 'setIsEditing', false),
    makeState('visible', 'setVisible', false),
    makeHandlers({
        handleCommit: props => e => {
            e && e.stopPropagation();
            batch(() => {
                props.onCommit(props.inputValue);
                props.setIsEditing(false);
            });
            props.setShowCheckBox(true);
        },
        handleEdit: props => e => {
            e && e.stopPropagation();
            props.setIsEditing(true);
            props.setShowCheckBox(false);
        },
        handleInputChange: props => e => {
            props.setInputValue(e.target.value);
        },
        handleReset: props => e => {
            e && e.stopPropagation();
            batch(() => {
                props.setInputValue(props.value);
                props.setIsEditing(false);
            });
            props.setShowCheckBox(true);
        },
    }),
    makeProps(props => ({
        canCommit: isFunction(props.validate)
            ? props.validate(props.inputValue)
            : validate(props.value, props.inputValue),
    })),
);

export function EditableText(props) {
    const {
        canCommit,
        classes,
        value,
        inputValue,
        isEditing,
        handleCommit,
        handleEdit,
        handleReset,
        handleInputChange,
        visible,
        setVisible,
    } = useEnhancer(props);
    return value ? (
        <div className={classes.root} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {isEditing ? (
                <InputBase
                    value={inputValue}
                    className={classes.editableInput}
                    onChange={handleInputChange}
                    onClick={e => {
                        e.stopPropagation();
                    }}
                    data-testid="input"
                    autoFocus
                />
            ) : (
                <Typography component="span" data-testid="title" className={classes.name}>
                    {truncate(value, 30)}
                </Typography>
            )}
            {/**if already editing, then show regardless*/}
            <div className={classes.icnbutton}>
                {(isEditing || visible) &&
                    (!isEditing ? (
                        <Tooltip title="Edit" placement="top">
                            <IconButton onClick={handleEdit} data-testid="toggle" color="inherit">
                                <EditIcon  fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    ) : canCommit ? (
                        <Tooltip title="Save" placement="top">
                            <IconButton onClick={handleCommit} data-testid="save" color="inherit" className={classes.deleteConf}>
                                <Checkmark className={classes.checkmark}   fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Cancel" placement="top">
                            <IconButton onClick={handleReset} data-testid="cancel" color="inherit" className={classes.deleteConf}>
                                <Clear fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ))}
            </div>
        </div>
    ) : null;
}

EditableText.propTypes = {
    onCommit: PropTypes.func.isRequired,
    validate: PropTypes.func,
    value: PropTypes.string,
};

const enhance = compose(
    withStyles(styles),
    React.memo,
);

export default enhance(EditableText);
