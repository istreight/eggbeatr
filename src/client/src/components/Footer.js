/**
 * FILENAME:    Footer.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the About class that displays content about the
 *  contruction of the lesson calendar web application.
 */

import React from 'react';

import Anchor from 'utils/Anchor';
import UnorderedList from 'utils/UnorderedList';


class Footer extends React.Component {
    render() {
        return (
            <div className="is-center">
                Made with &hearts;<br />by {
                    React.createElement(Anchor, {
                        "callback": () => null,
                        "data": "Isaac Streight",
                        "handleClick": () => null,
                        "hyperlink": "https://github.com/istreight/eggbeatr",
                        "key": "key-footer-anchor-0",
                        "styleClass": "footer-links"
                    })
                }
                <p>
                    Created during Winter 2016<br />
                    on the coast of BC, Canada
                </p>
                <UnorderedList
                    callback={ () => null }
                    data={ [
                        {
                            "data": ["Powered by"],
                            "styleClass": ""
                        },
                        { "data": [
                            React.createElement(Anchor, {
                                "callback": () => null,
                                "data": "React",
                                "handleClick": () => null,
                                "hyperlink": "https://reactjs.org",
                                "key": "key-footer-anchor-1",
                                "styleClass": "footer-links"
                            }),
                            ", ",
                            React.createElement(Anchor, {
                                "callback": () => null,
                                "data": "Webpack",
                                "handleClick": () => null,
                                "hyperlink": "https://webpack.js.org",
                                "key": "key-footer-anchor-2",
                                "styleClass": "footer-links"
                            }),
                            ", ",
                            React.createElement(Anchor, {
                                "callback": () => null,
                                "data": "Babel",
                                "handleClick": () => null,
                                "hyperlink": "https://babeljs.io",
                                "key": "key-footer-anchor-3",
                                "styleClass": "footer-links"
                            }),
                            ", & ",
                            React.createElement(Anchor, {
                                "callback": () => null,
                                "data": "PureCSS",
                                "handleClick": () => null,
                                "hyperlink": "http://purecss.io",
                                "key": "key-footer-anchor-4",
                                "styleClass": "footer-links"
                            })
                        ],
                        "styleClass": ""
                    }
                    ] }
                    styleClass={ "" }
                />
            </div>
        );
    }
}

export default Footer;
