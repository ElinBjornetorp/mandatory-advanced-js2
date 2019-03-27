import React, { Component } from 'react';
import './App.css';
import MainPage from './main.js';
import DetailsPage from './details.js';
import AddPage from './add.js';
import EditPage from './edit.js';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router-dom';
import {Link} from 'react-router-dom';

//const mainPage = MainPage.MainPage; <----- Why doesn't this work?

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'main',
      movies: [],
    };
  }

  render() {
    // let page = <MainPage.MainPage/>;

      return (
        <Router>
          <div className="App">
            <header>
              <h1>MovieApp</h1>
            </header>
            <nav>
              <Link to="/">Home</Link> <br/>
              <Link to="/add">Add a movie</Link>
            </nav>
            <Route exact path="/" component={MainPage.MainPage}/>
            <Route path="/details/:id" component={DetailsPage}/>
            <Route path="/add" component={AddPage.AddPage}/>
            <Route path="/edit/:id" component={EditPage}/>
          </div>
        </Router>
      );
    }
  }

export default App;
