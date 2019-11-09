/**
 * FILENAME:    AddRow.js
 * AUTHOR:      Isaac Streight
 * START DATE:  December 3rd, 2018
 *
 * This file contains the AddRow class, a specialization class for
 *  table row tags whith have an 'Add' button in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Input from 'utils/Input';
import TableRow from 'utils/TableRow';
import AddButton from 'specializations/AddButton';
import PreferencesButton from 'specializations/PreferencesButton';
import PrivatesOnlyCheckbox from 'specializations/PrivatesOnlyCheckbox';


class AddRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
        this.inputs = null;
    }

    componentWillMount() {
        this.inputs = [];

        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);
    }

    handleClick() {
        this.state.handleClick();
    }

    getCells() {
        var row = [];
        var show = this.state.show;

        if (show) {
            var inputWsi;
            var addButton;
            var inputFields;
            var inputInstructor;
            var inputDateOfHire;
            var preferenceButton;
            var privatesOnlyCheckbox;

            inputFields = [];

            inputInstructor = React.createElement(Input, {
                "callback": (ref)=> {
                    inputFields.push(ref);
                    Object.assign(this.inputs, inputFields);
                },
                "handleBlur": () => null,
                "key": "key-addrow-input-0",
                "placeholder": "...",
                "styleClass": "",
                "type": "text",
                "value": ""
            });

            inputDateOfHire = React.createElement(Input, {
                "callback": (ref)=> {
                    inputFields.push(ref);
                    Object.assign(this.inputs, inputFields);
                },
                "handleBlur": () => null,
                "key": "key-addrow-input-1",
                "placeholder": "...",
                "styleClass": "",
                "type": "text",
                "value": ""
            });

            inputWsi = React.createElement(Input, {
                "callback": (ref)=> {
                    inputFields.push(ref);
                    Object.assign(this.inputs, inputFields);
                },
                "handleBlur": () => null,
                "key": "key-addrow-input-2",
                "placeholder": "...",
                "styleClass": "",
                "type": "text",
                "value": ""
            });

            privatesOnlyCheckbox = React.createElement(PrivatesOnlyCheckbox, {
                "callback": () => null,
                "checked": false,
                "disabled": true,
                "handleChange": () => null,
                "instructorId": 0,
                "key": "key-addrow-checkbox-0"
            });

            // Disable by default.
            preferenceButton = React.createElement(PreferencesButton, {
                "callback": (ref) => ref.toggleState(true),
                "handleClick": () => null,
                "instructorName": "",
                "key": "key-addrow-pref-0"
            });

            addButton = React.createElement(AddButton, {
                "callback": () => null,
                "handleClick": this.handleClick.bind(this),
                "key": "key-addrow-addbutton-0"
            });

            row = [
                [inputInstructor],
                [inputDateOfHire],
                [inputWsi],
                [privatesOnlyCheckbox],
                [preferenceButton],
                [addButton]
            ];
        }

        return row;
    }

    toggleState(enable) {
        this.setState({
            "show": enable
        });
    }

    render() {
        return (
            <TableRow
                callback={ () => null }
                dataRow={ this.getCells() }
                isHeaderRow={ false }
                index={ this.state.index }
                styleCell={ this.state.styleCell }
                styleRow={ this.state.styleRow }
            />
        );
    }
}

AddRow.defaultProps = {
    show: false
};

AddRow.propTypes = {
    callback: PropTypes.func,
    handleClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    show: PropTypes.bool,
    styleCell: PropTypes.func.isRequired,
    styleRow: PropTypes.func.isRequired
}

export default AddRow;
