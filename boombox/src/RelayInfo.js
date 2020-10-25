import React from 'react';
import { useParams } from 'react-router';

function RelayInfo() {
    /*
    useEffect(() => {}) replaces componentDidMount()
    */
    let { info } = useParams();
    return <RelayInfoDisplay info={info} />;
}

class RelayInfoDisplay extends React.Component {
    render() {
        return <div>hello {this.props.info}</div>;
    }
}


export default RelayInfo;
