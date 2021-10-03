import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import Home from "./components/loadable";
import Topbar from "./components/topbar";
import Detail from "./components/detail";
import MyBookDetail from "./components/mybookdetail";
import Settings from "./components/settings";
import UploadPhoto from "./components/uploadphoto";
import ChangeUser from "./components/changeuser";
import MyProfile from "./components/myprofile";
import UserDetail from "./components/userdetail";
import AddBook from "./components/addbook";
import NotFound from './components/NotFound';
import Footer from "./components/footer";

export default class App extends Component {
render() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Topbar />
        <Switch>
        <Route exact path="/"><Home /></Route>
        <Route exact path="/detail" component={Detail} />
        <Route exact path="/mybookdetail" component={MyBookDetail} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/uploadphoto" component={UploadPhoto} />
        <Route exact path="/changeuser" component={ChangeUser} />
        <Route exact path="/myprofile" component={MyProfile} />
        <Route exact path="/userdetail" component={UserDetail} />
        <Route exact path="/addbook" component={AddBook} />
        <Route path="*" component={NotFound} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </Provider>
  );
}
}
