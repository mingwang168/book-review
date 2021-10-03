import React, { Component } from "react";
import { connect } from "react-redux";
import { BASE_URL } from "../config";

const picNotfound = process.env.PUBLIC_URL + "/asset/notFound.png";

class UploadPhoto extends Component {
  state = {
    photoUrl: "",
    showTagInput:false,
    tags:[],
    bookId:''
  };
  showPhoto = () => {
    let url = "";
    var file1 = this.file.files[0];
    var reader = new FileReader();
    reader.onload = (e) => {
      url = e.target.result;
      this.setState({
        photoUrl: url,
      });
    };
    this.setState({ photoUrl: url });
    reader.readAsDataURL(file1);
  };
  showTagInput=() => {
    this.setState({showTagInput:true})
  }
  tagSubmit=(e) => {
      e.preventDefault();
        let tag=this.tag.value.trim();
        this.setState((prevState)=>({
            showTagInput:false,
            tags:[...prevState.tags,tag]
        }),()=>{
            console.log(this.state.tags)
        })
  }
  showTags=() => {
      return this.state.tags.map((item,index)=>{
          return (
              <li key={index}>{item}</li>
          )
      })
  }
  submitBook=async() => {
      let title=this.title.value.trim();
      let author=this.author.value.trim();
      let data={title,author}
try {
    if(title!==''&&author!==''){
      await fetch(BASE_URL+'books',{
        method: "POST",
        headers: {
          'Accept': "application/json",
         'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.token}`,
        },
        body: JSON.stringify(data)
      })
      .then(response=>{
          return response.json()
      }).then(json=>{
          if(json.affectedRows===1){
          this.setState({
              bookId:json.insertId
          },()=>{
            console.log(this.state.bookId)
          })              
          }
      })
    }else{
        return
    }

} catch (error) {
    console.log(error);
}
//传封面
var file1 = this.file.files[0];
if (file1){
let formdata = new FormData();
formdata.append("file", file1);
if (this.file.files.length === 0) {
  alert("please select a file");
  return;
} else {
  await fetch(BASE_URL + "files?book="+this.state.bookId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      //下面这行不能加,否则传不上去.
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${this.props.token}`,
    },
    body: formdata,
  });
}
}

//传tags
if(this.state.tags!==[]){
    this.state.tags.map(async(item,index)=>{
        let data={name:item}
    await fetch(BASE_URL +'books/'+this.state.bookId+'/tag',{
        method: "POST",
        headers: {
          'Accept': "application/json",
         'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.token}`,
        },
        body: JSON.stringify(data)
    })        
    })    
}
let { history } = this.props
history.push({ pathname: '/' });
window.location.reload();
  }
  render() {
    return (
      <div>
        <div
          className="card mt-3"
          style={{ maxWidth: "1000px", margin: "auto" }}
        >
          <div className="row pe-3">
            <div className="col-md-4 col-12">
              <img
                src={
                  this.state.photoUrl === ""
                    ? picNotfound
                    : this.state.photoUrl
                }
                className="img-fluid rounded-start"
                alt="avatar"
                style={{  height: "400px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-5 col-12">
              <form action="POST">
                <h5 className="form-label mt-2">Title</h5>
                <input className="form-control" type="text" required ref={(input)=>{this.title=input}}/>
                <h5 className="form-label mt-2">Author</h5>
                <input className="form-control" type="text" required ref={(input)=>{this.author=input}}/>
                <h5 className="mt-3">Upload a book cover : </h5>
                <input
                  style={{ padding: "30px", color: "red",boxShadow:'1px 1px 2px black',border:'solid 1px grey',marginTop:'8px'}}
                  type="file"
                  className="chooseFile"
                  name="file"
                  multiple
                  id="fileId"
                  accept="image/*"
                  ref={(input) => {
                    this.file = input;
                  }}
                  onChange={this.showPhoto}
                />
                <br />
              </form>
            </div>
            <div className="col-md-3 col-12 pt-2" style={{borderLeft:'solid 1px grey'}}>
            <h5 className="form-label">Add Tags</h5>
            {this.showTags()}
            {this.state.showTagInput && <form onSubmit={this.tagSubmit}>
                <input type="text" style={{width:'150px',marginRight:'5px'}} ref={(input)=>{this.tag=input}} required/>
                <button className=" btn-primary"><i className="fa fa-check" type="submit"></i></button>
                <button className=" btn-primary ms-2" onClick={()=>{this.setState({showTagInput:false})}}><i className="fa fa-times"></i></button>
                </form>}
                <button type="button" className="btn btn-primary btn-sm mt-2" onClick={this.showTagInput} >+</button>
            </div>
          </div>
        </div >
                <button
                  type="submit"
                  className="btn btn-info mb-1 mt-3"
                  name="btn"
                  value="submit"
                  id="btnId"
                  style={{display:'block',margin:'auto'}}
                  onClick={this.submitBook}
                >
                  Submit
                </button>
      </div>
    );
  }
}
const mapState = (state) => ({
  avatarUrl: state.avatarUrl,
  userName: state.userName,
  token: state.token,
});
export default connect(mapState, null)(UploadPhoto);
