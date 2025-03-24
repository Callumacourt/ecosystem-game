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
        
        // Add random plants
        for (let i = 0; i < 10; i++) {
            const randomX = Math.floor(Math.random() * 800);  // Random X position
            const randomY = Math.floor(Math.random() * 600);  // Random Y position
            const randomPlant = new Plant(100, 10, 3, randomX, randomY);
            newEcosystem.addPlant(randomPlant);
        }

        // Add random herbivores
        for (let i = 0; i < 5; i++) {
            const randomX = Math.floor(Math.random() * 800);  // Random X position
            const randomY = Math.floor(Math.random() * 600);  // Random Y position
            const randomHerbivore = new Herbivore([randomX, randomY]);
            newEcosystem.addCreature(randomHerbivore);
        }

        // Add random predators
        for (let i = 0; i < 3; i++) {
            const randomX = Math.floor(Math.random() * 800);  // Random X position
            const randomY = Math.floor(Math.random() * 600);  // Random Y position
            const randomPredator = new Predator([randomX, randomY]);
            newEcosystem.addCreature(randomPredator);
        }
        
        // Initialize callbacks
        newEcosystem.initialiseCreatures(); 
        
        setEcosystem(newEcosystem);
        
        // Start the simulation update loop
        const interval = setInterval(() => {
            newEcosystem.updateEcosystem();

            setEcosystem(ecosystem => {
            
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
