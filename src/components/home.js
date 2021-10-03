import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { init_books,init_total_page } from "../redux/actionCreater";
import Cards from "./cards";
import {BASE_URL,PAGE_NUMBER} from '../config';

class Home extends Component {
  state={
    totalPages:0,
    initNumber:1,
    cursor:1,
    loopEnding:PAGE_NUMBER,
    sort:'',
    tagInput:'',
  }
 
componentDidMount=async()=> {
    await this.props.getBooks();
    var totalPages=Math.ceil(this.props.homeTotalBooks/12);
    this.setState({totalPages,});
    if(totalPages>PAGE_NUMBER){
      this.setState({loopEnding:PAGE_NUMBER})
    }else{
      this.setState({loopEnding:totalPages})
    }
  }

  showPage = () => {
     var arr=[];
    for (let i=this.state.initNumber;i<=this.state.loopEnding;i++){
      let oneLi=<li className={`page-item ${this.state.cursor===i?"active":""}`} key={i}><a className="page-link" href="#0" onClick={()=>{this.selectPage(i)}}>{i}</a></li>
        arr.push(oneLi)
    }
    return arr
  }

  selectPage=(n) => {
    this.setState(()=>{return({cursor:n})},()=>{
      this.props.getBooks("sort="+this.state.sort,"&tag="+this.state.tagInput,"&page="+this.state.cursor);
      })
  }
  prePage=() => {
    if(this.state.cursor>1){
      this.setState(prevState=>{return({cursor:prevState.cursor-1})},()=>{
      this.props.getBooks("sort="+this.state.sort,"&tag="+this.state.tagInput,"&page="+this.state.cursor);
      });
      if(this.state.cursor<this.state.initNumber+1){
        this.setState(prevState=>{return({initNumber:prevState.initNumber-1,loopEnding:prevState.loopEnding-1})});
      }
    }
  }
  nextPage=() => {
    if(this.state.cursor<this.state.totalPages){
    this.setState(prevState=>{return({cursor:prevState.cursor+1})},async()=>{
      await this.props.getBooks("sort="+this.state.sort,"&tag="+this.state.tagInput,"&page="+this.state.cursor);
    });
    if(this.state.cursor>=Math.ceil(PAGE_NUMBER/2) && this.state.cursor<this.state.totalPages-1){
      this.setState(prevState=>{return({initNumber:prevState.initNumber+1,loopEnding:prevState.loopEnding+1})});
    }
    }
  }
  tagSearch=(e) => {
    e.preventDefault();
    let tagInput=this.tagInput.value.trimEnd();
    this.setState({tagInput,},async()=>{
      await this.props.getBooks("sort="+this.state.sort,"&tag="+this.state.tagInput,"&page="+this.state.cursor);
      var totalPages=Math.ceil(this.props.homeTotalBooks/12);
      this.setState({totalPages,});
      if(totalPages>PAGE_NUMBER){
        this.setState({loopEnding:PAGE_NUMBER})
      }else{
        this.setState({loopEnding:totalPages})
      }
    })
  }
  handleSort=(e) => {
    this.setState({sort:e.target.value},async()=>{
     await this.props.getBooks("sort="+this.state.sort,"&tag="+this.state.tagInput,"&page="+this.state.cursor);
    })
  }
  render() {
console.log(this.state)
    return (
      <Fragment>
        <div
          className="homeContainer p-0 ps-3 pe-3 m-0"
          style={{ width: "100%",padding: "20px",borderTop:'dotted 1px grey'}}
        >
          <form className="d-flex justify-content-between align-items-center p-2 bg-light" onSubmit={this.tagSearch}>
            <span className="d-flex ms-2">
          <input className="form-control me-2 lh-sm" type="search" placeholder="Tag Searching" aria-label="Search" ref={input=>{this.tagInput=input;}}/>
          <button className="btn btn-outline-success btn-sm" type="submit">Search</button>              
            </span>
          <div className="d-flex ms-5" style={{border:'dotted 1px gray'}}>
          <span className="form-check ms-4">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="latest"  checked={this.state.sort==="latest"} onChange={this.handleSort}/>
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Latest
            </label>
          </span>
          <span className="form-check ms-4">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="earliest" checked={this.state.sort==="earliest"} onChange={this.handleSort}/>
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Earliest
            </label>
          </span>            
          <span className="form-check ms-4 me-4">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="most_comments" checked={this.state.sort==="most_comments"} onChange={this.handleSort}/>
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Most Comments
            </label>
          </span> 
          </div>
          </form>

          <div className="row row-cols-lg-6 row-cols-md-4 row-cols-sm-2 g-3 mt-2">
            <Cards books={this.props.books} />
          </div>
          <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center m-2">
            <li className={`page-item ${this.state.cursor===1?"disabled":""}`}  onClick={this.prePage}>
              <a className="page-link" href="#0" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
              {this.showPage()}
            <li className={`page-item ${this.state.cursor===this.state.totalPages?"disabled":""}`} onClick={this.nextPage}>
              <a className="page-link" href="#0" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav> 
          </div>
      </Fragment>
    );
  }
}

const mapState = (state) => ({
  books: state.books,
  homeTotalBooks: state.homeTotalBooks,
});

const mapDispatch = (dispatch) => ({
  getBooks: async (sort,tag,option) => {
    try {
      await fetch(BASE_URL+"books?"+sort+tag+option, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      })
      .then(response=>{
        let homeTotalBooks=response.headers.get('X-Total-Count');
        dispatch(init_total_page(homeTotalBooks));
        return response.json()
      })
      .then(json=>{
       dispatch(init_books(json));
      })
    } catch (error) {
      console.log("Request Failed", error);
    }
  }
});

export default connect(mapState, mapDispatch)(Home);
