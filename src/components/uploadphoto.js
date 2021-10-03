import React, { Component } from "react";
import { connect } from "react-redux";
import { BASE_URL } from "../config";

class UploadPhoto extends Component {
    state={
        photoUrl:''
    }
    showPhoto=()=>{
        let url=''
        var file1=this.file.files[0];
        var reader= new FileReader();
        reader.onload=(e=>{
            url=e.target.result;
            this.setState({
                photoUrl:url
            }) 
        })
        this.setState({photoUrl:url}) 
        reader.readAsDataURL(file1);
        }
    submitPhoto=async(e)=>{
        e.preventDefault()
        var file1=this.file.files[0];
        var data = new FormData();
        data.append('avatar',file1); 
        if (this.file.files.length === 0) {
            alert('please select a file');
            return;
        } else {
            await fetch(BASE_URL+'avatar',{
                method: 'POST',
                headers: {
                     'Accept':'application/json',
                    //下面这行不能加,否则传不上去,妈的不知道为啥.
                    // 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token}`
                },
                body:data,
            })
            .then(response=>{
              if(response.status===201){
                sessionStorage.setItem("AVATAR_URL", `${BASE_URL}user/${this.props.userId}/avatar`);
              }
            })
        }
        let { history } = this.props
        history.push({ pathname: '/settings' });
        window.location.reload();
    }
  render() {
    return (
      <div>
        <div
          className="card bg-dark text-white mt-2 mb-2"
          style={{ width: "19rem", margin: "auto" }}
        >
          <img
            src={this.state.photoUrl===''?this.props.avatarUrl:this.state.photoUrl}
            className="card-img-top"
            alt="avatar"
            style={{width:'303px',height:'330px',objectFit: "cover"}}
          />
          <div className="card-img-overlay">
            <h2 className="card-title text-center fw-bold ">{this.state.photoUrl===''?'Current Photo':'Photo Preview'}</h2>
          </div>
          <p className="card-title text-center">{this.props.userName}</p>
        </div>
        <div style={{margin:'20px',textAlign:'center'}}>
            <form action="post" onSubmit={this.submitPhoto}>
          <input style={{padding: "2px 0px 20px 30px",color:'red' }}
            type="file"
            className="chooseFile"
            name="file"
            multiple
            id="fileId"
            accept="image/*"
            ref={(input)=>{this.file=input}}
            onChange={this.showPhoto}
          />
          <br />
          <button
            type="submit"
            className="btn btn-info mb-1"
            name="btn"
            value="submit"
            id="btnId"
          >
            Submit
          </button>
        </form>
        </div>
      </div>
    );
  }
}
const mapState = (state) => ({
  avatarUrl: state.avatarUrl,
  userName: state.userName,
  userId:state.userId,
  token: state.token,
});
export default connect(mapState, null)(UploadPhoto);
