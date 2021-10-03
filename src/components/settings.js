import React, { Component } from "react";
import { connect } from "react-redux";
import {Link} from 'react-router-dom';


class Settings extends Component {
    
render(){
    return(
<div className="card mt-2 mb-2" style={{width:'19rem',margin:'auto'}}>
  <img src={this.props.avatarUrl} className="card-img-top" alt="avatar" style={{width:'303px',height:'330px',objectFit: "cover"}}/>
  <div className="card-body">
    <h6 className="card-title text-center">{this.props.userName}</h6>
  </div>
  <Link to={{
            pathname:'/uploadphoto'
          }}><div href="#" className="btn btn-outline-primary mb-2" style={{width:'100%'}}>Upload Photo</div></Link> 
    <Link to={{
            pathname:'/changeuser'
          }}><div href="#" className="btn btn-outline-primary" style={{width:'100%'}}>Change Username or Password</div></Link> 

</div>
    )
}
}
const mapState=(state) => ({
    avatarUrl:state.avatarUrl,
    userName:state.userName,
})
export default connect(mapState,null)(Settings);