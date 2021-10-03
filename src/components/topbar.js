import React, { Component, Fragment } from "react";
import Logged from "./logged";
import Unlogged from "./unlogged";
import {connect} from 'react-redux';
import { checkLogin } from "../redux/actionCreater";


class Topbar extends Component {

  UNSAFE_componentWillMount=()=>{
    this.props.checkLogin();
  }
  
  render() {
    return (
      <Fragment>
        {this.props.loginStatus?<Logged />:
        <Unlogged/>}
      </Fragment>
    );
  }
}
const mapState = (state) => ({
  loginStatus:state.loginStatus
})

const mapDispatch = (dispatch) => ({
  checkLogin:() => {
    dispatch(checkLogin());
  }
})
export default connect(mapState,mapDispatch)(Topbar);
