import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import "./App.css";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Pages/Login_Page/login";
import { Home } from "./Pages/Home/Home";
import { store } from "./Store";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      }
      setUser(data?.user);
      console.log(data?.user);
    };
    fetchUser();
  }, []);

  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={user ? <Home user={user} /> : <Login />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
