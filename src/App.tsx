import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TicTacToeComponent from "./components/TicTacToe";
import Rooms from "./components/Room";
import Login from "./components/Login";
import "./App.css";

type UserContextType = {
  user: string;
  setUser: (value: string) => void;
};

export const userContext = React.createContext<UserContextType>({
  user: "",
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState("");
  return (
    <userContext.Provider value={{ user, setUser }}>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/room" component={Rooms} />
          <Route path="/tictactoe" component={TicTacToeComponent} />
        </Switch>
      </Router>
    </userContext.Provider>
  );
}

export default App;
