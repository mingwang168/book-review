import { Link } from "react-router-dom";
import {BASE_URL} from '../config';

const picNotfound = process.env.PUBLIC_URL + "/asset/notFound.png";
const Cards=(props)=>{
const books=props.books;
if(books){
  const cards = books.map((item,key) => {
    let srcUrl;
    if (item.file == null) {
      srcUrl = picNotfound;
    } else {
      srcUrl = `${BASE_URL}files/${item.file.id}/serve?size=thumbnail`;
    }
    return (
        <div className="card" key={item.id}>
          <Link to={{
            pathname:'/detail',
            state:item
          }} style={{textDecoration:"none",color:"black"}}>
          <img
            src={srcUrl}
            className="card-img-top"
            alt="..."
            style={{height: "280px", objectFit: "cover" }}
          />
            <h6 className="card-title" style={{overflow:'hidden',height:'40px',display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:'2'}}>{item.title}</h6>
            </Link>
          <div className="card-body p-0">
            <p className="card-text m-0">By: {item.author}</p>
            <p
              className="card-text"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span className="m-2"><i className="fa fa-commenting-o" style={{color:'blue'}} aria-hidden="true"></i> : {item.totalComments}</span>
              <span className="m-2"><i className="fa fa-heart-o" style={{color:'red'}} aria-hidden="true"></i> : {item.totalLiks}</span>
            </p>
          </div>
          <Link to={{
            pathname:'/userdetail',
            state:item.user
          }} style={{textDecoration:"none",color:"black"}}>
          <div className="card-footer">
            <small className="text-muted">
            U/L : {item.user.name}
            </small>
          </div></Link>
        </div>
    );
  });
  return cards;
}else{
  return (
    <div>Loading...</div>
  )
}
}
export default Cards;