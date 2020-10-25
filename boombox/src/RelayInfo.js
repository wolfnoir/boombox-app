import React from 'react';
import { useParams } from 'react-router';

function RelayInfo() {
    /*
    useEffect(() => {}) replaces componentDidMount()
    */
    let { info } = useParams();
    return <div>hello {info}</div>;
}

export default RelayInfo;
