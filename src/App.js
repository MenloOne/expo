import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Discover from './Discover';
import Wallet from './Wallet';
import Guild from './Guild';
import Profile from './Profile';

export default () =>
(<BrowserRouter>
	<Switch>
	<Route path="/" exact component={Discover}/>
	<Route path="/wallet" exact component={Wallet}/>
	<Route path="/guild" exact component={Guild}/>
	<Route path="/profile" exact component={Profile}/>
	</Switch>
</BrowserRouter>);