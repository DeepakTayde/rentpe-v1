import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const EMarket = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center">
            E-Market by RentPe
          </h1>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EMarket;
