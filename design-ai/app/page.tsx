import Demonstration from "./components/demonstration";
import Features from "./components/features";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Demonstration />
      </main>
      <Footer />
    </div>
  )
}
