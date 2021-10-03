import React from "react";
import Modal from "react-modal";

const ModalLogin = (props) => {
    let open=Boolean(props.open);
    let username,password='';
  return (
    <Modal
      ClassName="modal"
      isOpen={open}
      onRequestClose={() => {
        props.handleOpen(false);
      }}
      contentLabel="Login"
    >
      <h2 style={{ textAlign: "center",color:'burlywood' }}>Login</h2>
      <p className="text-danger">{props.message}</p>
      <div className="loginBox" style={{textAlign: "center"}}>
        <label className="loginLabel">UserName : </label>
        <input type="text" hidden />
        <input className="loginInput" ref={(input)=>{username=input}} type="text" id="username" autoComplete="off" required></input>
        <br />
        <label className="loginLabel">PassWord :&nbsp;</label>
        <input type="password" hidden/>
        <input className="loginInput" ref={(input)=>{password=input}} type="password" id="password" autoComplete="new-password" required></input>
        <br />
        <button type="button" className="btn btn-primary" onClick={() => { props.handleLogin(username.value.trim(),password.value.trim());
        }}>
          LogIn
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => { props.handleOpen(false) }}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

Modal.setAppElement("#root");

export default ModalLogin;
