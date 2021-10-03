import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { BASE_URL,PAGE_NUMBER } from "../config";
const picNotfound = process.env.PUBLIC_URL + "/asset/notFound.png";
const picNoAvartar = process.env.PUBLIC_URL + "/asset/noAvartar.png";

class UserDetail extends Component {
    state={
        avatarUrl:'',
        userbooks:[],
        userlikes:[],
        usercomments:[],
        userTotalBooks:0,
        totalPages:0,
        initNumber:1,
        cursor:1,
        loopEnding:PAGE_NUMBER,
        userTotalLikes:0,
        likeTotalPages:0,
        likeInitNumber:1,
        likeCursor:1,
        likeLoopEnding:PAGE_NUMBER,
        userTotalComments:0,
        commentTotalPages:0,
        commentInitNumber:1,
        commentCursor:1,
        commentLoopEnding:PAGE_NUMBER
    }
user=this.props.location.state;
componentDidMount=async() => {
this.getAvatar();
await this.getUserLikes();
await this.getUserComments();
await this.getUserBooks();
var totalPages=Math.ceil(this.state.userTotalBooks/12);
this.setState({totalPages,});
if(totalPages>PAGE_NUMBER){
  this.setState({loopEnding:PAGE_NUMBER})
}else{
  this.setState({loopEnding:totalPages})
}
var likeTotalPages=Math.ceil(this.state.userTotalLikes/12);
this.setState({likeTotalPages,});
if(likeTotalPages>PAGE_NUMBER){
  this.setState({likeLoopEnding:PAGE_NUMBER})
}else{
  this.setState({likeLoopEnding:likeTotalPages})
}
var commentTotalPages=Math.ceil(this.state.userTotalComments/12);
this.setState({commentTotalPages,});
if(commentTotalPages>PAGE_NUMBER){
  this.setState({commentLoopEnding:PAGE_NUMBER})
}else{
  this.setState({commentLoopEnding:commentTotalPages})
}
}
getAvatar=async () => {
    let avatarUrl='';
    let avatar = await fetch(BASE_URL + "user/"+this.user.id+"/avatar");
          if (avatar.status === 200) {
            avatarUrl = BASE_URL + "user/"+this.user.id+"/avatar";
          } else {
            avatarUrl = picNoAvartar;
          }
          this.setState({avatarUrl})
}
getUserBooks=async(option) => {
    try {
        let res = await fetch(`${BASE_URL}books?user=${this.user.id}&action=published&${option}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
        });
        let data = await res.json();
        if(res.status===200){
          let userTotalBooks=res.headers.get('X-Total-Count');
            this.setState({
                userbooks:data,
                userTotalBooks,
            })
        }
      } catch (error) {
        console.log("Request Failed", error);
      }
}
getUserLikes=async(option) => {
    try {
        let res = await fetch(`${BASE_URL}books?user=${this.user.id}&action=liked&${option}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
        });
        let data = await res.json();
        if(res.status===200){
          let userTotalLikes=res.headers.get('X-Total-Count');
            this.setState({
                userlikes:data,
                userTotalLikes
            })
        }
      } catch (error) {
        console.log("Request Failed", error);
      }
}
getUserComments=async(option) => {
    try {
        let res = await fetch(`${BASE_URL}comments?user=${this.user.id}&action=replied&${option}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
        });
        let data = await res.json();
        if(res.status===200){
          let userTotalComments=res.headers.get('X-Total-Count');
            this.setState({
                usercomments:data,
                userTotalComments,
            })
        }
      } catch (error) {
        console.log("Request Failed", error);
      }
}
card=(item) => {
    let srcUrl;
    if (item.file == null) {
      srcUrl = picNotfound;
    } else {
      srcUrl = `${BASE_URL}files/${item.file.id}/serve?size=thumbnail`;
    }
    return(
      <div className="col p-1" key={item.id}>
      <div className="card h-100" key={item.id} style={{padding:'0px'}}>
        <Link to={{
          pathname:'/detail',
          state:item
        }} style={{textDecoration:"none",color:"black"}}>
        <img
          src={srcUrl}
          className="card-img-top"
          alt="..."
          style={{height: "200px", objectFit: "cover" }}
        />
          <p className="card-title m-1"  style={{overflow:'hidden',height:'50px',display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:'2'}}>{item.title}</p>
          </Link>
          <div className="card-body m-1 p-0">
          <p className="card-text small m-0 p-0">By : {item.author}</p>
          <p
            className="card-text small"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span className="m-2"><i className="fa fa-commenting-o" style={{color:'blue'}} aria-hidden="true"></i> : {item.totalComments}</span>
            <span className="m-2"><i className="fa fa-heart-o" style={{color:'red'}} aria-hidden="true"></i> : {item.totalLiks}</span>
          </p>
        </div>
      </div>
      </div>
    )
}
comment=(item) => {
    return(
      <div className="card text-dark bg-light" key={item.id} style={{maxHeight:'200px',overflow:'auto'}} onMouseEnter={()=>{this.setState({operateCommentId:item.id})}} onMouseLeave={()=>{this.setState({operateCommentId:''})}}>
      <div className="card-header">
          <p className="lh-sm" style={{overflow:'hidden',height:'40px',display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:'2',margin:'0'}}>{item.book.title}</p>
          <span className="float-end" style={{fontStyle:'italic',fontSize:'0.8rem'}}>- - By: {item.book.author}</span> 
          </div>
         <div className="card-body">
         <p className="card-text lh-sm" style={{fontSize:'0.9rem'}}>{item.content}</p>
         </div>
      </div>
    )
}
showUserBooks=()=>{
    return this.state.userbooks.map((item,index)=>{
        return this.card(item);
    })
}

showUserLikes=() => {
    return this.state.userlikes.map((item,index)=>{
        return this.card(item);
    })
}

showUserComments=() => {
    return this.state.usercomments.map((item,index)=>{
        return this.comment(item);
    })
}
showPage = () => {
  var arr=[];
 for (let i=this.state.initNumber;i<=this.state.loopEnding;i++){
   let oneLi=<li className={`page-item ${this.state.cursor===i?"active":""}`} key={i} style={{cursor:'pointer'}}><span className="page-link" onClick={()=>{this.selectPage(i)}}>{i}</span></li>
     arr.push(oneLi)
 }
 return arr
}
selectPage=(n) => {
  this.setState(()=>{return({cursor:n})},()=>{
    this.getUserBooks("page="+this.state.cursor);
    })
}
prePage=() => {
  if(this.state.cursor>1){
    this.setState(prevState=>{return({cursor:prevState.cursor-1})},()=>{
    this.getUserBooks("page="+this.state.cursor);
    });
    if(this.state.cursor<this.state.initNumber+1){
      this.setState(prevState=>{return({initNumber:prevState.initNumber-1,loopEnding:prevState.loopEnding-1})});
    }
  }
}
nextPage=() => {
  if(this.state.cursor<this.state.totalPages){
  this.setState(prevState=>{return({cursor:prevState.cursor+1})},()=>{
    this.getUserBooks("page="+this.state.cursor);
  });
  if(this.state.cursor>=Math.ceil(PAGE_NUMBER/2) && this.state.cursor<this.state.totalPages-1){
    this.setState(prevState=>{return({initNumber:prevState.initNumber+1,loopEnding:prevState.loopEnding+1})});
  }
  }
}
showLikePage = () => {
  var arr=[];
 for (let i=this.state.likeInitNumber;i<=this.state.likeLoopEnding;i++){
   let oneLi=<li className={`page-item ${this.state.likeCursor===i?"active":""}`} key={i} style={{cursor:'pointer'}}><span className="page-link" onClick={()=>{this.likeSelectPage(i)}}>{i}</span></li>
     arr.push(oneLi)
 }
 return arr
}
likeSelectPage=(n) => {
  this.setState(()=>{return({likeCursor:n})},()=>{
    this.getUserLikes("page="+this.state.likeCursor);
    })
}
likePrePage=() => {
  if(this.state.likeCursor>1){
    this.setState(prevState=>{return({likeCursor:prevState.likeCursor-1})},()=>{
    this.getUserLikes("page="+this.state.likeCursor);
    });
    if(this.state.likeCursor<this.state.likeInitNumber+1){
      this.setState(prevState=>{return({likeInitNumber:prevState.likeInitNumber-1,likeLoopEnding:prevState.likeLoopEnding-1})});
    }
  }
}
likeNextPage=() => {
  if(this.state.likeCursor<this.state.likeTotalPages){
  this.setState(prevState=>{return({likeCursor:prevState.likeCursor+1})},()=>{
    this.getUserLikes("page="+this.state.likeCursor);
  });
  if(this.state.likeCursor>=Math.ceil(PAGE_NUMBER/2) && this.state.likeCursor<this.state.likeTotalPages-1){
    this.setState(prevState=>{return({likeInitNumber:prevState.likeInitNumber+1,likeLoopEnding:prevState.likeLoopEnding+1})});
  }
  }
}
showCommentPage = () => {
  var arr=[];
 for (let i=this.state.commentInitNumber;i<=this.state.commentLoopEnding;i++){
   let oneLi=<li className={`page-item ${this.state.commentCursor===i?"active":""}`} key={i} style={{cursor:'pointer'}}><span className="page-link" onClick={()=>{this.commentSelectPage(i)}}>{i}</span></li>
     arr.push(oneLi)
 }
 return arr
}
commentSelectPage=(n) => {
  this.setState(()=>{return({commentCursor:n})},()=>{
    this.getUserComments("page="+this.state.commentCursor);
    })
}
commentPrePage=() => {
  if(this.state.commentCursor>1){
    this.setState(prevState=>{return({commentCursor:prevState.commentCursor-1})},()=>{
    this.getUserComments("page="+this.state.commentCursor);
    });
    if(this.state.commentCursor<this.state.commentInitNumber+1){
      this.setState(prevState=>{return({commentInitNumber:prevState.commentInitNumber-1,commentLoopEnding:prevState.commentLoopEnding-1})});
    }
  }
}
commentNextPage=() => {
  if(this.state.commentCursor<this.state.commentTotalPages){
  this.setState(prevState=>{return({commentCursor:prevState.commentCursor+1})},()=>{
    this.getUserComments("page="+this.state.commentCursor);
  });
  if(this.state.commentCursor>=Math.ceil(PAGE_NUMBER/2) && this.state.commentCursor<this.state.commentTotalPages-1){
    this.setState(prevState=>{return({commentInitNumber:prevState.commentInitNumber+1,commentLoopEnding:prevState.commentLoopEnding+1})});
  }
  }
}
render(){
    return(
        <Fragment>
            <div className="card m-2 userDetails">
                <div className="row g-0">
                    <div className="col-md-1 text-center col-12 userProfile p-2">
                        <img className="img-fluid rounded-start" src={this.state.avatarUrl} alt="avatar" style={{objectFit: "cover",width:'150px'}}/>
                        <p>{this.user.name}</p>
                    </div>
                    <div className="col-md-11 col-12 userInfo">
                        <div className="card-body">
                            <div className="userBooks">
                                <h5 className="card-title m-2 ms-0 me-0 p-2 bg-info">Uploaded Books:</h5>
                                <div className="homeContainer" style={{ width: "100%", height: "auto", padding: "0px"}}>
                                  <div className="row row-cols-lg-6 row-cols-md-4 row-cols-sm-2">
                                   {this.showUserBooks()}
                                  </div>
                                </div>
                            </div>
                            <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-center m-2">
                            <li className={`page-item ${this.state.cursor===1?"disabled":""}`}  onClick={this.prePage} style={{cursor:'pointer'}}>
                              <span className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                              </span>
                            </li>
                              {this.showPage()}
                            <li className={`page-item ${this.state.cursor===this.state.totalPages?"disabled":""}`} onClick={this.nextPage} style={{cursor:'pointer'}}>
                              <span className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                              </span>
                            </li>
                          </ul>
                        </nav> 
                            <hr />
                            <div className="userLikes mt-3">
                                <h5  className="card-title m-2 ms-0 me-0 p-2 bg-warning">Likes:</h5>
                                <div className="homeContainer" style={{ width: "100%", height: "auto", padding: "0px"}}>
                                  <div className="row row-cols-lg-6 row-cols-md-4 row-cols-sm-2">
                                {this.showUserLikes()}
                                </div>
                                </div>
                                  <nav aria-label="Page navigation example">
                                  <ul className="pagination justify-content-center m-2">
                                    <li className={`page-item ${this.state.likeCursor===1?"disabled":""}`}  onClick={this.likePrePage} style={{cursor:'pointer'}}>
                                      <span className="page-link" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                      </span>
                                    </li>
                                      {this.showLikePage()}
                                    <li className={`page-item ${this.state.likeCursor===this.state.likeTotalPages?"disabled":""}`} onClick={this.likeNextPage} style={{cursor:'pointer'}}>
                                      <span className="page-link" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                      </span>
                                    </li>
                                  </ul>
                                </nav> 
                            </div>
                            <div className="userComments mt-3">
                                <h5 className="card-title m-2 ms-0 me-0 p-2" style={{backgroundColor:'lightpink'}}>Comments:</h5>
                                <div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
                                {this.showUserComments()}                                    
                                </div>
                            </div>
                            <nav aria-label="Page navigation example">
                                  <ul className="pagination justify-content-center m-2">
                                    <li className={`page-item ${this.state.commentCursor===1?"disabled":""}`}  onClick={this.commentPrePage} style={{cursor:'pointer'}}>
                                      <span className="page-link" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                      </span>
                                    </li>
                                      {this.showCommentPage()}
                                    <li className={`page-item ${this.state.commentCursor===this.state.commentTotalPages?"disabled":""}`} onClick={this.commentNextPage} style={{cursor:'pointer'}}>
                                      <span className="page-link" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                      </span>
                                    </li>
                                  </ul>
                                </nav>
                        </div>
                    </div>
                </div>

            </div>
        </Fragment>
    )
}
}

export default UserDetail