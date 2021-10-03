import React from 'react';
import Loadable from 'react-loadable';

const LoadableComponent = Loadable({
    loader: ()=>import('./home.js'),
    loading:()=>{
        return <div>LOADING...</div>
    }
});

const l = () => <LoadableComponent />
export default  l