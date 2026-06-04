import Hero from "@/components/Hero";
import About from "@/components/About";
import Programs from "@/components/Programs";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <Hero />
      <About />
      <Programs />
      <Testimonial />
      <Contact />
    </main>
  );
}
