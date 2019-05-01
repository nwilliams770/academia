import React from 'react';
import { Link } from 'react-router';

const Main = React.createClass({
    render() {
        return (
            <div>
                <h1>
                    <Link to="/">Reduxstagram</Link>
                </h1>
                {React.cloneElement(this.props.children, this.props)}
                {/* Any props that are coming down from parents will be passed along to PhotoGrid or Single */}
            </div>
        )
    }
});

export default Main;
