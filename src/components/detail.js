import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { BASE_URL,COMMENT_LIMITATION } from "../config";

const picNotfound = process.env.PUBLIC_URL + "/asset/notFound.png";
const picNoAvartar = process.env.PUBLIC_URL + "/asset/noAvartar.png";
const like=process.env.PUBLIC_URL + "/asset/like.png";

class Detail extends Component {
  state = {
    book: this.props.location.state,
    comments: [],
    likes: [],
    showComments:false,
    replyFlag:'',
    userLike:false,
    commentLeft:COMMENT_LIMITATION,
    totalLiks:this.props.location.state.totalLiks
  };
  componentDidMount= () => {
    this.getComments();
    this.checkUserLike();
  }
  showTags = () => {
    if (this.state.book.tags !== null) {
      let tags = this.state.book.tags.map((item, index) => {
        return (
          <span className="badge bg-info text-dark m-1" key={item.id}>
            {item.name}
          </span>
        );
      });
      return tags;
    } else {
      return <span>no tag.</span>;
    }
  };

  getComments = async () => {
    try {
      let response = await fetch(`${BASE_URL}comments?book=${this.state.book.id}`);
      let comments = await response.json();
      if (response.ok === true) {
        this.setState({
          comments,
        }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  replyComment=async (comment) => {
    console.log(comment);
    console.log(this.replyText);
    let reply=this.replyText.value.trim();
    let data={
      content:reply,
      bookId:comment.book.id
    }
    if(reply===''){
      alert('Reply cannot be empty.');
      return
    }
    try {
      await fetch(BASE_URL+'comments/'+comment.id+'/reply',{
        method:'POST',
        headers:{
          'Accept': "application/json",
          'Content-Type': 'application/json',
           Authorization: `Bearer ${this.props.token}`,
        },
        body: JSON.stringify(data)
      })
      .then(response=>{
        if(response.status===201){
          this.setState({
            replyFlag:''
          });
          this.getComments();
        }
      })
    } catch (error) {
      
    }
  }
  showComments = () => {
    return this.state.comments.map((item, index) => {
      return (
        <button type="button" className="btn btn-outline-secondary text-start m-1 p-2" style={{cursor:'default',maxWidth:'200px'}} key={item.id}>
          {item.parentId!==null?<p className="badge bg-primary d-block m-0">Reply</p>:<p className="badge bg-dark d-block m-0">Comment</p>}
          {item.content}{"  "}
          {item.parentId===null && <span className="badge rounded-pill bg-secondary">{item.totalReplies} replies</span>}
          <p style={{fontSize:'small',fontStyle:'italic',textAlign:'end',margin:'0'}}>- - {item.user.name}</p>
          {item.parentId===null && this.state.replyFlag!==item.id && <span className="badge bg-success mx-auto d-block m-1" style={{cursor:'pointer'}} onClick={()=>{this.setState({replyFlag:item.id})}}>Reply it</span>}
          {this.state.replyFlag===item.id &&<span>
            <textarea className="form-control mt-1" placeholder="Reply here" id="floatingTextarea" style={{height: '100px',width:'182px'}} ref={text=>{this.replyText=text}} required></textarea>
            <span className="d-flex justify-content-around mt-1">
            <span className="btn btn-sm btn-primary" onClick={()=>{this.replyComment(item)}}>Submit</span>     
            <span className="btn btn-sm btn-info" onClick={()=>{this.setState({replyFlag:''})}}>Cancel</span>                
            </span>
          </span>}
        </button>
      );
    });
  };
  setLikes = async() => {
    try {
      let response = await fetch(`${BASE_URL}books/${this.state.book.id}/like`);
      let likes = await response.json();
      let avatarUrl = "";
      if (response.ok === true) {

        let likesWithAvatar=await Promise.all(likes.map(async (item,index) => {
          await fetch(BASE_URL + "user/"+item.id+"/avatar")
          .then(response=>{
            if (response.status === 200) {
              avatarUrl = BASE_URL + "user/"+item.id+"/avatar";
            } else {
              avatarUrl = picNoAvartar;
            }
            item.avatar=avatarUrl;
          });
          return await item
        }));

        this.setState((prevState)=>
        {if(prevState.likes.length===0){
          return({likes:likesWithAvatar})
        }else{
          return({likes:[]})
        }});
      }
    } catch (error) {
      console.log(error);
    }
  };
  showLikes =() => {
    return this.state.likes.map((item, index) => {
      return (
        <span key={item.id}>
        <img src={item.avatar} alt="avatar" width="30" height="30" style={{borderRadius:'50% 50%'}}/>
        <button type="button" className="btn btn-sm bg-light text-dark text-start m-1" key={item.id}>
          {item.name}
        </button>
        </span>
      );
    });
  };
  submitNewComment=async () => {
    let content=this.text.value.trim();
    if(content===''){
      alert('Comment cannot be empty.');
      return
    }
    let data={
      content,
      userId:this.props.userId,
      bookId:this.state.book.id
    }
    try {
      await fetch(BASE_URL+'comments',{
        method:'POST',
        headers:{
          'Accept': "application/json",
          'Content-Type': 'application/json',
           Authorization: `Bearer ${this.props.token}`,
        },
        body: JSON.stringify(data)
      })
      .then(response=>{
        if(response.status===201){
          this.text.value='';
          this.getComments();
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  toggleShowComment= () => {
    this.setState(prevState=>{
      return({
        showComments:!(prevState.showComments)
      })
    })
  }
  checkUserLike=async () => {
    try {
      await fetch(BASE_URL+'books/'+this.state.book.id+'/like')
      .then(response=>(response.json()))
      .then(json=>{
        let likedUser=json.find(o=>o.id===this.props.userId);
        if(!likedUser){
          this.setState({
            userLike:false
          })
        }else{
          this.setState({
            userLike:true
          })
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  like= async () => {
    try {
      await fetch(BASE_URL+'books/'+this.state.book.id+'/like',{
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          Authorization: `Bearer ${this.props.token}`
        }        
      })
      .then(response=>{
        if(response.status===201){
          this.setState((prevState)=>{
            return(
              {
                userLike:true,
                totalLiks:prevState.totalLiks+1
              }
            )
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  cancelLike=async () => {
    try {
      await fetch(BASE_URL+'books/'+this.state.book.id+'/like',{
        method:'DELETE',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          Authorization: `Bearer ${this.props.token}`
        }        
      })
      .then(response=>{
        if(response.status===200){
          this.setState((prevState)=>{
            return(
              {
                userLike:false,
                totalLiks:prevState.totalLiks-1
              }
            )
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  countWord=() => {
    if(this.text.value.length>COMMENT_LIMITATION){
      this.text.value=this.text.value.substring(0,COMMENT_LIMITATION);
    }else{
      this.setState({commentLeft:COMMENT_LIMITATION-this.text.value.length})
    }
  }
  render() {
    let srcUrl;
    if (this.state.book.file == null) {
      srcUrl = picNotfound;
    } else {
      srcUrl = `${BASE_URL}files/${this.state.book.file.id}/serve?size=thumbnail`;
    }
    return (
      <Fragment>
        <div
          className="card m-3"
          style={{margin: "20px auto"}}
        >
          <div className="row g-0">
            <div className="col-md-3 col-sm-12 col-12">
              <img
                src={srcUrl}
                className="img-fluid rounded-start mx-auto d-block"
                alt="book cover"
                style={{ height: "450px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-9 col-sm-12 col-12 d-flex" style={{height:'452px',scrollBehavior:'smooth',overflow:'auto'}}>
              <div className="card-body ">
              {this.state.userLike?
                   <span className="d-flex justify-content-between p-0 m-0 align-items-start">
                     <span>
                       <span className="card-title fs-4 text-danger">{this.state.book.title}</span>
                       <img src={like} alt="like" style={{width:'30px',height:'30px',cursor:'pointer',marginLeft:'10px'}}/>                       
                     </span>
                   <p className="btn btn-sm btn-secondary me-3 align-self-start" onClick={this.cancelLike} style={{width:'120px'}}>Cancel Like</p>
                   </span>:
                   <span className="d-flex justify-content-between p-0 m-0 align-items-start">
                   <span className="card-title fs-4">{this.state.book.title}</span>
                   <p className="btn btn-sm btn-danger me-3 align-self-start" onClick={this.like} style={{width:'90px'}}>Like</p>
                   </span>
                   }
                <p className="card-text fst-italic mt-2">
                  By : {this.state.book.author}
                </p>
                <p className="card-text fst-italic mt-2">
                  Uploaded By : {this.state.book.user.name}
                </p>
                <p className="card-text">
                  <i className="fa fa-tags" aria-hidden="true"></i> :{" "}
                  {this.showTags()}
                </p>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm position-relative m-2"
                  onClick={this.toggleShowComment}
                >
                  Comments
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {this.state.comments.length}
                  </span>
                </button> <br />
                {this.state.showComments && <div className="card-text">
                  <small className="text-muted">{this.showComments()}</small>
                </div>}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm position-relative m-2"
                  onClick={this.setLikes}
                >
                  Likers
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {this.state.totalLiks}
                  </span>
                </button>
                <div>
                  {this.showLikes()}
                </div>
              </div>
              <div className="form-floating m-3" style={{width:'200px'}}>
                 <textarea className="form-control  required" placeholder="Leave a comment here" id="floatingTextarea" style={{height: '300px',width:'200px'}} ref={text=>{this.text=text}}  required onKeyUp={this.countWord}></textarea>
                 <label htmlFor="floatingTextarea">Add New Comment :</label>
                 <span>You are {this.state.commentLeft} characters left.</span>
                 <button className="float-end btn btn-primary btn-sm m-2" onClick={this.submitNewComment}>Add</button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapState = (state) => ({
  userId:state.userId,
  token:state.token
});
const mapDispatch = () => ({});

export default connect(mapState, mapDispatch)(Detail);
