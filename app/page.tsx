import connectMongoDB from "@/config/mongodb";
import LoginComponent from "./components/LoginComponent";


export default function Home() {


  connectMongoDB();
  return (
    <div>
      <LoginComponent/>
    </div>
  );
}
