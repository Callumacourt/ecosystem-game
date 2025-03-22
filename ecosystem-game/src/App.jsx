import { useEffect, useState } from "react";
import SimulationCanvas from "./components/SimulationCanvas";
import Ecosystem from "./game/Ecosystem";
import Plant from "./game/Enviroment/Plant";
import Predator from "./game/Animals/Predator";
import Herbivore from "./game/Animals/Herbivore";

const App = () => {
    const [ecosystem, setEcosystem] = useState(new Ecosystem());

    useEffect(() => {
        // Initialize Ecosystem
        const newEcosystem = new Ecosystem();
        
        // Add some plants and creatures for testing
        newEcosystem.addPlant(new Plant(100, 10, 3, 100, 100));
        newEcosystem.addPlant(new Plant(100, 10, 3, 300, 200));
        newEcosystem.addCreature(new Herbivore([150, 250]));
        newEcosystem.addCreature(new Predator([400, 300]));
        
        // Initialize callbacks
        newEcosystem.initialiseCreatures(); 
        
        setEcosystem(newEcosystem);
        
        // Start the simulation update loop
        const interval = setInterval(() => {
            newEcosystem.updateEcosystem();
            // Force a proper re-render by creating a new ecosystem reference
            setEcosystem(ecosystem => {
                // Create a deep copy or at least a new reference
                const updatedEcosystem = new Ecosystem();
                // Copy over the properties
                updatedEcosystem.plants = [...newEcosystem.plants];
                updatedEcosystem.creatures = [...newEcosystem.creatures];
                updatedEcosystem.grid = newEcosystem.grid;
                return updatedEcosystem;
            });
        }, 100);
        
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div>
            <h1>Ecosystem Simulation</h1>
            <SimulationCanvas ecosystem={ecosystem} />
        </div>
    );
};

export default App;