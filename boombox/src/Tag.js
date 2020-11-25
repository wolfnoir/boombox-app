import React from 'react';
import './css/bootstrap.min.css';
import './Tag.css';

class Tag extends React.Component {
    render() {
        return(
            <a href={"/tag/" + this.props.content}>
                <button type="button" className="btn btn-primary tag-button" key={"tag"+ this.props.number}>{this.props.content}</button>
            </a>
        )
    }
}

export default Tag;