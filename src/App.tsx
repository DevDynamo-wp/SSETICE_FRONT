import { Home } from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className=" justify-center items-center flex flex-col h-screen bg-gray-200">
      <div className="bg-amber-300 m-4 flex justify-center items-center w-15 h-15 rounded-full">
        <Home className="text-blue-500 w-10 h-10" />
      </div>
      <h1 className="text-3xl flex items-center bg-amber-300 font-bold underline">
        Hello world!
      </h1>
    </div>
  );
}

export default App;
