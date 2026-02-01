import { FlightList } from "./components/FlightList";
import { PriceGraph } from "./components/PriceGraph";
import { SearchForm } from "./components/SearchForm";
import { useRef } from "react";

function App() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const onSearchComplete = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-main-200 min-h-screen relative gap-10">
      <h1 className="md:text-3xl text-4xl font-bold text-center md:text-left p-2 text-main-900 font-Gothic">
        Skyviewr
      </h1>

      <SearchForm onSearchComplete={onSearchComplete} />
      <div ref={sectionRef}>
      <FlightList  />
      <PriceGraph/>
      </div>
      
    </div>
  );
}

export default App;
