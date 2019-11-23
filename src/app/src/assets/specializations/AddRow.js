/**
 * FILENAME:    AddRow.js
 * AUTHOR:      Isaac Streight
 * START DATE:  December 3rd, 2018
 *
 * This file contains the AddRow class, a specialization class for
 *  table row tags whith have an 'Add' button in the application.
 *
 * @format
 */
import React from "react";
import PropTypes from "prop-types";
import Input from "utils/Input";
import TableRow from "utils/TableRow";
import AddButton from "specializations/AddButton";
import PreferencesButton from "specializations/PreferencesButton";
import PrivatesOnlyCheckbox from "specializations/PrivatesOnlyCheckbox";
class AddRow extends React.Component {
    constructor(props) {
        super(props);
        this.inputs = [];
        this.state = {
            ...props
        };
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
            let addButton;
            let inputFields;
            let preferenceButton;
            let privatesOnlyCheckbox;
            inputFields = [];
            for (let i = 0; i < 3; i++) {
                row.push([React.createElement(Input, {
                    callback: (ref) => {
                        inputFields.push(ref);
                        Object.assign(this.inputs
                            , inputFields);
                    }
                    , key: "key-addrow-input-" + this.state
                        .index + "-" + i
                    , placeholder: "..."
                    , type: "text"
                })]);
            }
            if (this.props.componentType === "Instructors") {
                // Disable by default.
                privatesOnlyCheckbox = React.createElement(
                    PrivatesOnlyCheckbox, {
                        disabled: true
                        , handleChange: () => null
                        , instructorId: 0
                        , key: "key-addrow-checkbox-" + this.state.index
                    });
                // Disable by default.
                preferenceButton = React.createElement(
                    PreferencesButton, {
                        callback: (ref) => ref.toggleState(true)
                        , handleClick: () => null
                        , instructorId: 0
                        , key: "key-addrow-pref-" + this.state.index
                    });
                row.push([privatesOnlyCheckbox]);
                row.push([preferenceButton]);
            }
            addButton = React.createElement(AddButton, {
                handleClick: this.handleClick.bind(this)
                , key: "key-addrow-addbutton-0"
            });
            row.push([addButton]);
        }
        return row;
    }
    toggleState(enable) {
        this.setState({
            show: enable
        });
    }
    render() {
        return ( <
            TableRow dataRow = {
                this.getCells()
            }
            isHeaderRow = {
                false
            }
            index = {
                this.state.index
            }
            styleCell = {
                this.state.styleCell
            }
            styleRow = {
                this.state.styleRow
            }
            />
        );
    }
}
AddRow.defaultProps = {
    callback: () => null
    , show: false
};
AddRow.propTypes = {
    callback: PropTypes.func
    , componentType: PropTypes.string.isRequired
    , handleClick: PropTypes.func.isRequired
    , index: PropTypes.number.isRequired
    , show: PropTypes.bool
    , styleCell: PropTypes.func.isRequired
    , styleRow: PropTypes.func.isRequired
};
export default AddRow;