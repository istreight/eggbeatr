/**
 * FILENAME:    Table.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the Table class, a utility class for
 *  table tags in the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Table from 'utils/Table';


class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
        this.node = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentDidMount() {
        this.node = ReactDOM.findDOMNode(this);
        this.props.callback(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    componentDidUpdate() {
        var nodeClassList = this.node.classList;

        if (this.state.isDisplayed) {
            nodeClassList.add("show");
            nodeClassList.remove("hide");
        } else {
            nodeClassList.add("hide");
            nodeClassList.remove("show");
        }
    }

    render() {
        return (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            { this.state.header }
                        </div>
                        <div className="modal-body">
                            { this.state.body }
                            <Table
                                dataBody={ this.state.tableData.dataBody }
                                dataHeader={ this.state.tableData.dataHeader }
                                styleCell={ this.state.tableData.styleCell }
                                styleRow={ this.state.tableData.styleRow }
                                styleTable={ this.state.tableData.styleTable }
                            />
                        </div>
                        <div className="modal-footer">
                            { this.state.footer }
                        </div>
                    </div>
                </div>
        );
    }
}

Modal.defaultProps = {
    callback: () => null,
    isDisplayed: false
}

Modal.propTypes = {
    body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    callback: PropTypes.func,
    footer: PropTypes.array.isRequired,
    header: PropTypes.array.isRequired,
    isDisplayed: PropTypes.bool,
    tableData: PropTypes.object.isRequired
}

export default Modal;
