import "./home.css";

import { Header } from "./components/header";
import { Search } from "./components/search";

import { ClerkProvider } from '@clerk/nextjs';

export default function Home() {

  return (
    <div className="HomeComponent">
      <Header />

      <Search />
    </div>
  );
}
