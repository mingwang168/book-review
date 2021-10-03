import React from "react";
import Modal from "react-modal";

const ModalSignup = (props) => {
  let open = Boolean(props.open);
  let username,
    password,confirm = "";
  return (
    <Modal
      ClassName="modal"
      isOpen={open}
      onRequestClose={() => {
        props.handleOpen(false);
      }}
      contentLabel="Sign Up"
    >
      <h2 style={{ textAlign: "center", color: "burlywood" }}>Sign Up</h2>
      <p className="text-danger">{props.message}</p>
      <div className="signupBox" style={{ textAlign: "center" }}>
        <label className="signupLabel">UserName : </label>
        <input
          className="signupInput"
          ref={(input) => {
            username = input;
          }}
          type="text"
          id="username" autoComplete="off"
          required
        ></input>
        <br />
        <label className="signupLabel">PassWord :&nbsp;</label>
        <input
          className="signupInput"
          ref={(input) => {
            password = input;
          }}
          type="password"
          id="password" autoComplete="off"
          required
        ></input>
        <br />
        <label className="signupLabel">Confirm : &nbsp;&nbsp;&nbsp;</label>
        <input
          className="signupInput"
          ref={(input) => {
            confirm = input;
          }}
          type="password"
          id="confirm" autoComplete="off"
          required
        ></input>
        <br />
        <button
          type="button"
          className="btn btn-primary signup-btn"
          onClick={() => {
            props.handleSignup(username.value.trim(), password.value.trim(), confirm.value.trim())
          }}
        >
          SignUp
        </button>
        <button
          type="button"
          className="btn btn-secondary signup-btn"
          onClick={() => {
            props.handleOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

Modal.setAppElement("#root");

export default ModalSignup;
