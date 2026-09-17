import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Programs from "@/components/landing/Programs";
import Testimonial from "@/components/landing/Testimonial";
import Contact from "@/components/landing/Contact";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
