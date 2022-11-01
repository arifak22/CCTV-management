import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login    = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404  = React.lazy(() => import('./views/Pages/Page404'));
const Page500  = React.lazy(() => import('./views/Pages/Page500'));

function PrivateRoute(props) {
  if(!props.isLoggedIn)
    return <Redirect to="/login" />

  if(! (localStorage.getItem("ListMenu") === null) ){
    console.log(props.location.pathname);
    var access = JSON.parse(localStorage.getItem("ListMenu")).access;
    var isAccess= access.includes(props.location.pathname);

    if(!isAccess)
      return <Redirect to="/404" />
  }
  return <Route { ...props } />
}

const LoginRoute = ({ isLoggedIn, ...props }) =>
  !isLoggedIn
    ?  <Route { ...props } />
    : <Redirect to="/dashboard" />

class App extends Component {
 
  render() {
    var token = localStorage.getItem("token");
    var isLoggedIn = token ? true : false;

    return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>

              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />

              <LoginRoute isLoggedIn={ isLoggedIn } path="/login" render={props => <Login {...props}/> } />
              <PrivateRoute isLoggedIn={ isLoggedIn } path="/" render={props => <DefaultLayout {...props}/> } />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
