/**
 * FILENAME:    Footer.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the About class that displays content about the
 *  contruction of the lesson calendar web application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Anchor from 'utils/Anchor';
import UnorderedList from 'utils/UnorderedList';


class Footer extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
    }

    componentWillMount() {
        this.setState(this.props.initData, () => {
            this.props.callback(this.state, "footer", false)
        });
    }

    render() {
        return (
            <div className="is-center">
                { this.state.data.name }
                <Anchor
                    callback={ () => null }
                    data={ this.state.data.tag }
                    handleClick={ () => null }
                    hyperlink={ this.state.data.url }
                    styleClass={ "footer-links" }
                />
            </div>
        );
    }
}

Footer.defaultProps = {
    initData: {
        "data": {
            "name": "",
            "tag": "",
            "url": ""
        }
    }
}

Footer.propTypes = {
    callback: PropTypes.func.isRequired,
    initData: PropTypes.object
}

export default Footer;
