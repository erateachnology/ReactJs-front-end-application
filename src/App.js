import './App.css';
import SignIn from './components/LoginComponent';
import SignUp from './components/CompanyRegister';
import AdminHome from './Admin/AdminHome';
import CompanyHome from './Company/CompanyHome';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
function App() {
  return (
    <Router>
         <div className="App">
           <Switch>
             <Route exact path="/">
             <SignIn/>
             </Route>
             <Route path = "/dashboard">
             <AdminHome/>
             </Route>
             <Route path = '/home'>
             <CompanyHome/>
             </Route>
             <Route path = "/signUp">
               <SignUp/>
             </Route>
           </Switch>
        </div>
        </Router>
  );
}

export default App;
