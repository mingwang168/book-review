import { AUTH_TOKEN, BASE_URL } from "../config";

const picNoAvartar = process.env.PUBLIC_URL + "/asset/noAvartar.png";

export const init_books = (data) => ({
  type: "init_books",
  data,
});
export const init_total_page = (data) => ({
  type: "init_total_page",
  data,
});
export const init_mybooks = (data) => ({
  type: "init_mybooks",
  data,
});
export const renew_loginStatus = (data) => ({
  type: "renew_loginStatus",
  data,
});
export const handleLoginOpenModal = (data) => ({
  type: "handleLoginOpenModal",
  data: { loginOpenModal: data, message: "" },
});
export const handleSignupOpenModal = (data) => ({
  type: "handleSignupOpenModal",
  data: { signupOpenModal: data, message: "" },
});
export const sendMessage = (data) => ({
  type: "sendMessage",
  data,
});
export const logOut = (data) => ({
  type: "logOut",
  data,
});
export const handleLogin = (username, password) => {
  return async (dispatch) => {
    await fetch(BASE_URL + "login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        password: password,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(async (json) => {
        if (json["token"]) {
          let avatarUrl = "";
          let avatar = await fetch(BASE_URL + "user/"+json["id"]+"/avatar");
          if (avatar.status === 200) {
            avatarUrl = BASE_URL + "user/"+json["id"]+"/avatar";
          } else {
            avatarUrl = picNoAvartar;
          }
          sessionStorage.setItem(AUTH_TOKEN, json["token"]);
          sessionStorage.setItem("USER_NAME", username);
          sessionStorage.setItem("USER_ID", json["id"]);
          sessionStorage.setItem("AVATAR_URL", avatarUrl);
          dispatch(
            renew_loginStatus({
              loginMessage: "The user has been logged in.",
              userId: json["id"],
              userName: json["name"],
              token: json["token"],
              loginStatus: true,
              loginOpenModal: false,
              avatarUrl: avatarUrl,
              message: "",
            })
          );
        } else {
          dispatch(
            renew_loginStatus({
              loginMessage: "An error occured at login. Try again.",
              loginStatus: false,
              loginOpenModal: true,
              message: json["message"],
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
export const handleSignup = (username, password, confirm) => {
  var message = "";
  return async (dispatch) => {
    if (password === confirm) {
      await fetch(BASE_URL + "users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          password: password,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          if (json["insertId"]) {
            dispatch(handleSignupOpenModal(false));
          } else {
            message = json["message"];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      message = "Passwords didn’t match. Try again.";
    }
    dispatch(sendMessage(message));
  };
};
export const checkLogin = () => {
  return (dispatch) => {
    if (
      sessionStorage.getItem(AUTH_TOKEN) !== null &&
      sessionStorage.getItem(AUTH_TOKEN) !== "undefined"
    ) {
      dispatch(
        renew_loginStatus({
          loginMessage: "The user has been logged in.",
          userName: sessionStorage.getItem("USER_NAME"),
          userId: sessionStorage.getItem("USER_ID") * 1,
          token: sessionStorage.getItem(AUTH_TOKEN),
          avatarUrl: sessionStorage.getItem("AVATAR_URL"),
          loginStatus: true,
        })
      );
    } else {
      dispatch(
        renew_loginStatus({
          loginMessage: "The user has not been logged in.",
          loginStatus: false,
        })
      );
    }
  };
};
