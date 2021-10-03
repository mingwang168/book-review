import React, { Component, Fragment } from "react";
import ModalLogin from './login';
import ModalSignup from './signup';
import { connect } from "react-redux";
import {handleLoginOpenModal,handleSignupOpenModal,handleLogin,handleSignup} from '../redux/actionCreater';
const logo=process.env.PUBLIC_URL+'asset/books.png';

class Unlogged extends Component {
  errMessage='';
  getError=()=>{
    this.errMessage=this.props.message;
    console.log(this.props.message)
  }
  
 render() {
    return (
      <Fragment>
        <nav className="navbar navbar-light bg-light">
          <form className="container-fluid justify-content-between">
          <a
              className="navbar-brand mb-0 h1"
              href="/"
              style={{ textShadow: "1px 1px 1px grey", padding: "0px",textAlign:'end' }}
            ><img src={logo} alt="logo" style={{width:'35px',height:"35px",objectFit: "cover",margin:'2px 10px 3px 0px'}}/>
              Book Review
            </a>
            <div className="buttongroup">
              <button className="btn btn-sm btn-outline-success" type="button" onClick={this.props.handleLoginOpenModal}>
                Login
              </button>
              <button className="btn btn-sm btn-outline-primary" type="button"  onClick={this.props.handleSignupOpenModal}>
                Sign Up
              </button>
            </div>
          </form>
        </nav>
        <ModalLogin open={this.props.loginOpen} handleLogin={this.props.handleLogin} handleOpen={this.props.handleLoginOpenModal} message={this.props.message}/>
        <ModalSignup open={this.props.signupOpen} handleSignup={this.props.handleSignup} handleOpen={this.props.handleSignupOpenModal} message={this.props.message}/>
      </Fragment>
    );
  }
}

const mapState=(state)=>({
loginOpen:state.loginOpenModal,
signupOpen:state.signupOpenModal,
message:state.message
})

const mapDispatch=(dispatch) => ({
  handleLoginOpenModal:(open=true)=>{
    dispatch(handleLoginOpenModal(open))
  },
  handleSignupOpenModal:(open=true)=>{
    dispatch(handleSignupOpenModal(open))
  },
  handleLogin:(username,password)=>{
    dispatch(handleLogin(username,password))
  },
  handleSignup:(username,password,confirm)=>{
    dispatch(handleSignup(username,password,confirm))
  },
})
export default connect(mapState,mapDispatch)(Unlogged);
