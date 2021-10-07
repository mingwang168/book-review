import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { BASE_URL,COMMENT_LIMITATION } from "../config";

const picNotfound = process.env.PUBLIC_URL + "/asset/notFound.png";
const picNoAvartar = process.env.PUBLIC_URL + "/asset/noAvartar.png";

class MyBookDetail extends Component {
  state = {
    book: this.props.location.state,
    comments: [],
    likes: [],
    showTagInput:false,
    tags:[],
    delTagId:0,
    photoUrl:'',
    editBookflag:false,
    newBook:{},
    replyFlag:'',
    showComments:false,
    commentLeft:COMMENT_LIMITATION,
  };
  tags=[];
  componentDidMount=async() => {
    this.fetchTags();
    this.getComments();
    await fetch(BASE_URL+'books/'+this.state.book.id)
    .then(response=>(response.json()))
    .then(json=>{
      if(json.file===null){
        this.setState({
          photoUrl:picNotfound
        })
      }else{
        this.setState({
          photoUrl:`${BASE_URL}files/${json.file.id}/serve?size=thumbnail`
        })
      }
      this.setState({
        newBook:json
      })
    })
  }

fetchTags=async () => {
  try {
    await fetch(BASE_URL+'books/'+this.state.book.id)
    .then(response=>{
      if(response.status===200){
        return response.json()
      }
    })
    .then(json=>{
      if(json.tags!==null){
        let tags=json.tags;
        tags.map((item,index)=>{
          this.setState((prevState)=>{
            return ({tags:[...prevState.tags,item]})
          })
          return null
        })
      }
    })
  } catch (error) {
    
  }
}
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
  toggleShowComment= () => {
    this.setState(prevState=>{
      return({
        showComments:!(prevState.showComments)
      })
    })
  }
  showComments = () => {
    return this.state.comments.map((item, index) => {
      return (
        <button type="button" className="btn btn-outline-secondary text-start m-1 p-2" style={{cursor:'default',maxWidth:'220px',maxHeight:'200px',overflow:'auto'}} key={item.id}>
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
          this.setState({commentLeft:COMMENT_LIMITATION})
          this.getComments();
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  setLikes = async() => {
    try {
      let response = await fetch(`${BASE_URL}books/${this.state.book.id}/like`);
      let likes = await response.json();
      let avatarUrl = "";
      if (response.ok === true) {
        console.log(likes);
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
          console.log(item)
          return await item
        }));
        console.log(likesWithAvatar);
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
  showTagInput=() => {
    this.setState({showTagInput:true})
  }
  tagSubmit=(e) => {
      e.preventDefault();
      let tag=this.tag.value.trim();
      this.tags.push(tag);
      console.log(this.tags);
      this.setState({
          showTagInput:false,
      })
}
showInputTags=() => {
  return this.tags.map((item,index)=>{
      return (
          <li key={index}>{item}</li>
      )
  })
}
submitTags=async() => {
  if(this.tags!==null){
    try {
    this.tags.map(async(item,index)=>{
        let data={name:item}
    await fetch(BASE_URL +'books/'+this.state.book.id+'/tag',{
        method: "POST",
        headers: {
          'Accept': "application/json",
         'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.token}`,
        },
        body: JSON.stringify(data)
    }).then(_=>{
      window.location.reload();
    })
    })
    } catch (error) {
      console.log(error)
    }
}

}

showTags=() => {
  if(this.state.tags.length===0){
    return (
      <span>No Tags.</span>
    )
  }else{
return this.state.tags.map((item,index)=>{
  return(
    <span className="badge bg-info text-dark m-1 fs-6" key={index} onMouseEnter={()=>{this.setState({delTagId:item.id})}} onMouseLeave={()=>{this.setState({delTagId:''})}}>
    {item.name}{this.state.delTagId===item.id?<span className="badge bg-danger ms-2" onClick={()=>{this.delTag(item.id)}}  style={{cursor:'pointer'}}>Del</span>:''}
  </span>
  )
})    
  }
}

submitPhoto=async(e)=>{
  e.preventDefault()
  var file1=this.file.files[0];
  var data = new FormData();
  data.append("file", file1); 
  if (this.file.files.length === 0) {
      alert('please select a file');
      return;
  } else {
      await fetch(BASE_URL + "files?book="+this.state.book.id,{
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
        if(response.status===200){
          alert('Upload book cover successfully.');
        }
        return response.json();
      })
      .then(json=>{
        if(json.affectedRows===1){
          this.setState({
            photoUrl:`${BASE_URL}files/${json.insertId}/serve?size=thumbnail`
          })
        }
      });
  }
}

delTag=async (id) => {
  let data={
    tagId:id
  }
try {
  await fetch(BASE_URL+'books/'+this.state.book.id+'/tag',{
    method: "DELETE",
    headers: {
      'Accept': "application/json",
     'Content-Type': 'application/json',
      Authorization: `Bearer ${this.props.token}`,
    },
    body: JSON.stringify(data)
  })
  .then(response=>{
    if(response.status===200){
      return response.json()
    }
  })
  .then(json=>(json))
} catch (error) {
  console.log(error)
}
window.location.reload()

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

  delBook=async () => {
    let confirm=window.confirm("Are you sure you want to delete this book?");
    try {
    if(confirm===true){
      //删除所有tag
      this.state.tags.map(async(item,index)=>{
        let data={
          tagId:item.id
        }
        await fetch(BASE_URL+'books/'+this.state.book.id+'/tag',{
          method: "DELETE",
          headers: {
            'Accept': "application/json",
           'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.token}`,
          },
          body: JSON.stringify(data)
        })
      })
      //删除所有comment
      this.state.comments.map(async (item,index)=>{
        await fetch(BASE_URL+'comments/'+item.id,{
          method: "DELETE",
          headers: {
            'Accept': "application/json",
           'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.token}`,
          }
        })
      })
      //删除所有file
      await fetch(BASE_URL+'books/'+this.state.book.id+'/file',{
        method: "DELETE",
        headers: {
          'Accept': "application/json",
         'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.token}`,
        }
      })
      //删除所有like
      await fetch(BASE_URL+'books/'+this.state.book.id+'/like',{
        method: "DELETE",
        headers: {
          'Accept': "application/json",
         'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.token}`,
        }
      })
      //删除book
      await fetch(BASE_URL+'books/'+this.state.book.id,{
        method:'DELETE',
        headers:{
          'Accept': "application/json",
         'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.token}`,
        }
      })
    }
    }catch(error){
      console.log(error);
  }
  window.history.back(-1);
}

editBook=async () => {
  this.setState({
    editBookflag:true
  })
}

submitEditBook=async (e) => {
  e.preventDefault();
  let title=this.editTitleInput.value.trim();
  let author=this.editAuthorInput.value.trim();

  let data={
    title,
    author,
  }
  await fetch(BASE_URL+'books/'+this.state.book.id,{
    method:'PATCH',
    headers:{
      'Accept': "application/json",
     'Content-Type': 'application/json',
      Authorization: `Bearer ${this.props.token}`,
    },
    body: JSON.stringify(data)
  })
  this.setState({
    editBookflag:false,
  })
  //window.history.back(-1);
  window.location.reload()
}
countWord=() => {
  if(this.text.value.length>COMMENT_LIMITATION){
    this.text.value=this.text.value.substring(0,COMMENT_LIMITATION);
  }else{
    this.setState({commentLeft:COMMENT_LIMITATION-this.text.value.length})
  }
}
  render() {
    return (
      <Fragment>
        <div
          className="card m-3"
          style={{margin: "20px auto", height:'466px',scrollBehavior:'smooth',overflow:'auto',}}
        >
          <div className="row g-0">
            <div className="col-md-3 col-12">
              <img
                src={this.state.photoUrl}
                className="img-fluid rounded-start mx-auto d-block"
                alt="book cover"
                style={{ height: "360px", objectFit: "cover" }}
              />
              <div style={{border:'dotted 1px grey'}}>
                <h6 className='m-1'>Upload new book cover : </h6>
                <div style={{textAlign:'center'}}>
            <form action="post" onSubmit={this.submitPhoto}>
          <input style={{padding: "2px 0px 5px 20px",color:'red' }}
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
            className="btn btn-primary m-1 me-2 btn-sm float-center"
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
            <div className="col-md-6 col-12 p-2" style={{height:'466px'}}>
              <div className="card-body">
                {this.state.editBookflag?
                <form style={{display:'flex'}} onSubmit={this.submitEditBook}>
                  <div>
                    <div className="m-1">Title :</div>
                    <div className="m-1 mt-3"> Author:</div>
                  </div>
                  <div>
                  <input type="text" className="m-1" style={{width:'95%'}} defaultValue={this.state.newBook.title} ref={input=>{this.editTitleInput=input}}/>
                  <input type="text" className="m-1" style={{width:'95%'}} defaultValue={this.state.newBook.author} ref={input=>{this.editAuthorInput=input}}/> 
                  </div>
                  <div className="btn-group-vertical">
                    <button className="btn btn-sm btn-outline-primary m-1" type="submit">Ok</button>
                    <button className="btn btn-sm btn-outline-secondary m-1" onClick={()=>{this.setState({editBookflag:false})}}>Cancel</button>                    
                  </div>

                </form>
                 :
              <span>
                 <h4 className="card-title text-danger">{this.state.newBook.title}
              <span className="btn btn-sm btn-outline-danger float-end ms-2" onClick={this.delBook}>Delete</span>
              <span className="btn btn-sm btn-outline-success float-end" onClick={this.editBook}>Edit</span>
              </h4>
              <p className="card-text fst-italic mt-2">
                By : {this.state.newBook.author}
              </p>
              </span>
              }

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
                    {this.state.book.totalLiks}
                  </span>
                </button>
                <div>
                  {this.showLikes()}
                </div>
              </div>
            </div>
            <div className="col-md-3 col-12 ps-3 pt-3" style={{borderLeft:'solid 1px grey'}}>
                
            <div className="form-floating" style={{width:'95%'}}>
                 <textarea className="form-control  required" placeholder="Leave a comment here" id="floatingTextarea" style={{height: '150px',width:'100%'}} ref={text=>{this.text=text}}  required onKeyUp={this.countWord}></textarea>
                 <label htmlFor="floatingTextarea">Add New Comment :</label>
                 <span>You are {this.state.commentLeft} characters left.</span>
                 <button className="float-end btn btn-primary btn-sm m-2" onClick={this.submitNewComment}>Add</button>
                 </div> <br />
                 <div className="mt-5">
            <h6 className="form-label">Add New Tags :</h6>
            {this.showInputTags()} <br />
            {this.state.showTagInput && <form onSubmit={this.tagSubmit}>
                <input type="text" style={{width:'150px',marginRight:'5px'}} ref={(input)=>{this.tag=input}} required/>
                <button className=" btn-primary"><i className="fa fa-check" type="submit"></i></button>
                <button className=" btn-primary ms-2" onClick={()=>{this.setState({showTagInput:false})}}><i className="fa fa-times"></i></button>
                </form>}
                <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={this.showTagInput} >✚</button> <br />
                <button className="btn btn-primary btn-sm me-3 mt-3 float-end" onClick={this.submitTags}>Submit</button>                   
                 </div>


            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapState = (state) => ({
  token:state.token,
  userId:state.userId
});


export default connect(mapState, null)(MyBookDetail);
