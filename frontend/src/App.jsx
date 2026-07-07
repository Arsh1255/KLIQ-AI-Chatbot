import Chat from "./pages/Chat";
import Auth from "./pages/Auth";

export default function App() {
  const token = localStorage.getItem("token");
  return token ? <Chat /> : <Auth />;
}
