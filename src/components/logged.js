import React, { Component, Fragment } from "react";
import {Link} from 'react-router-dom';
import { connect } from "react-redux";
import { checkLogin, logOut } from "../redux/actionCreater";
import { AUTH_TOKEN } from "../config";
const logo=process.env.PUBLIC_URL+'asset/books.png';
class Logged extends Component {
  componentDidMount = () => {
    this.props.checkLogin();
  };

  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <div className="container-fluid">
            <a
              className="navbar-brand mb-0 h1"
              href="/"
              style={{ textShadow: "1px 1px 1px grey", padding: "0px",textAlign:'end' }}
            ><img src={logo} alt="logo" style={{width:'35px',height:"35px",objectFit: "cover",marginRight:'10px'}}/>
              Book Review
            </a>
            <div style={{display:'flex'}}>
              <Link to={{pathname:'/addbook'}}> <button type="button" className="btn btn-outline-primary me-4">Add Book</button></Link>
              <img className="avatar" src={this.props.avatarUrl} alt="user" width="40" height="35" style={{objectFit: "cover"}}/>              
            <ul className="">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {" "}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <div>
                    <p className="dropdown-header text-center fs-6">
                      {this.props.userName}
                    </p>
                  </div>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                  <Link to={{pathname:'/settings'}} style={{textDecoration:'none'}}><span className="dropdown-item" href="/">Settings</span></Link>
                  </li>
                  <li>
                    <Link to={{pathname:'/myprofile',state:{id:this.props.userId,name:this.props.userName}}} style={{textDecoration:'none'}}><span className="dropdown-item" href="/">My Profile</span></Link> 
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/"
                      onClick={this.props.logOut}
                    >
                      Log Out
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          </div>
        </nav>
      </Fragment>
    );
  }
}

const mapState = (state) => ({
  userId: state.userId,
  userName: state.userName,
  avatarUrl: state.avatarUrl,
});
const mapDispatch = (dispatch) => ({
  checkLogin: () => {
    dispatch(checkLogin());
  },
  logOut: () => {
    try {
      sessionStorage.removeItem(AUTH_TOKEN);
      sessionStorage.removeItem("USER_NAME");
      sessionStorage.removeItem("USER_ID");
      sessionStorage.removeItem("AVATAR_URL");
    } catch (error) {
      console.log(error);
    }
    dispatch(
      logOut({
        loginMessage: "The user has not been logged out.",
        loginStatus: false,
        userId: "",
        userName: "",
        token: "",
      })
    );
  },
});

export default connect(mapState, mapDispatch)(Logged);
