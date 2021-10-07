import React, { Component } from "react";
import { connect } from "react-redux";
import { BASE_URL } from "../config";

class ChangeUser extends Component {
    state={
        passwordsConpareMessage:'',
        ajaxMessage:''
    }
    submitUser=async(e) => {
        e.preventDefault();
        let newPassword=this.newPassword.value.trim();
        let validatePassword=this.validatePassword.value.trim();
        let newUsername=this.newUsername.value.trim();
        let confirmPassword=this.confirmPassword.value.trim();
        let update={};
        if(newPassword && !newUsername){
            update={"password":newPassword}
        }
        if(!newPassword && newUsername){
            update={
                    "name":newUsername
                }
        }
        if(newPassword && newUsername){
            update={
                    "password":newPassword,
                    "name":newUsername
                }
        }
        let data={
            "validate":{
                "password":validatePassword
            },
            update
        }
        if(newPassword!==confirmPassword){
            this.setState({
                passwordsConpareMessage:'Passwords didn’t match. Try again.',
                ajaxMessage:''
            })
            return;
        }
        try {
        await fetch(BASE_URL+'users',{
            method: 'PATCH',
            headers: {
                 'Accept':'application/json',
                 'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.token}`
            },
            body:JSON.stringify(data)
        }).then(response=>{
            if(response.status===200){
                if(update.hasOwnProperty("name")){
                    sessionStorage.setItem("USER_NAME", newUsername);
                }
            }
            return response.json()
        }).then(json=>{
           let  message=json.message;
           this.setState(()=>{return{
                ajaxMessage:message,
                passwordsConpareMessage:''
            }},()=>{
                console.log(this.state.ajaxMessage)
                if(json.affectedRows===1){
                   let { history } = this.props
                   history.push({ pathname: '/settings' });
                   window.location.reload();
                }
            })
        });    
        } catch (error) {
            console.log(error);
        }
    }
  render() {
    return (
      <div>
        <div
          className="card mt-2 mb-2"
          style={{ width: "29rem",height:"480px", margin: "auto" }}
        >
          <div style={{margin:'20px',textAlign:'center'}}>
            <form action="post" onSubmit={this.submitUser}>
                <div className="card-header">
                    <span style={{textAlign:'start',fontSize:'1.0rem',fontWeight:'bold'}}>Enter Your Password : &nbsp;</span>
                    <input type="password"  autoComplete="off" ref={input=>{this.validatePassword=input}} required />
                </div>
                <p style={{color:'red',margin:'10px',fontSize:'1.2rem'}}>&nbsp;{this.state.ajaxMessage}</p>
            <h5 style={{textAlign:'start'}}>Change Username :</h5>  <hr className="m-0"/>
            <p className="text-primary m-3">Current Username : {this.props.userName}</p>
            New Username : &nbsp;<input type="text" autoComplete="off" ref={input=>{this.newUsername=input}}/><br />
            <h5 style={{textAlign:'start',marginTop:'20px'}}>Change Password :</h5> <hr className="m-0"/>
            <table style={{borderCollapse:'separate',borderSpacing:'5px 6px'}}>
                <tbody>
                    <tr><td colSpan="2" align="center" style={{color:'red',fontSize:'1.2rem'}}>&nbsp;{this.state.passwordsConpareMessage}</td></tr>
                    <tr className="tablerow">
                        <td className="col-title" autoComplete="new-password"> New Password :  &nbsp;</td>
                        <td><input type="password" ref={input=>{this.newPassword=input}}/></td>
                    </tr>
                    <tr className="tablerow">
                        <td className="col-title" autoComplete="new-password"> Confirm New Password :  &nbsp;</td>
                        <td><input type="password" ref={input=>{this.confirmPassword=input}}/></td>
                    </tr>
                </tbody>
            </table>
          <button
            type="submit"
            className="btn btn-info mt-3"
            name="btn"
            value="submit"
            id="btnId"
          >
            Submit
          </button>
        </form>
        </div>
        </div>

      </div>
    );
  }
}
const mapState = (state) => ({
  userName: state.userName,
  token: state.token,
});
export default connect(mapState, null)(ChangeUser);
