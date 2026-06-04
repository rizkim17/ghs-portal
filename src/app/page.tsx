import Hero from "@/components/Hero";
import About from "@/components/About";
import Programs from "@/components/Programs";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">
        <Hero />
        <About />
        <Programs />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
