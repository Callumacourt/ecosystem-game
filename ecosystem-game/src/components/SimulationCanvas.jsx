import { useEffect, useRef } from "react";

const SimulationCanvas = ({ ecosystem }) => {
    const canvasRef = useRef(null);
    const cellSize = 50; // Match grid cell size

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size (adjust as needed)
        canvas.width = 800;
        canvas.height = 600;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

            // Draw Grid
            ctx.strokeStyle = "#ddd";
            for (let x = 0; x < canvas.width; x += cellSize) {
                for (let y = 0; y < canvas.height; y += cellSize) {
                    ctx.strokeRect(x, y, cellSize, cellSize);
                }
            }

            // Draw Plants (Green)
            ctx.fillStyle = "green";
            ecosystem.plants.forEach((plant) => {
                ctx.beginPath();
                ctx.arc(plant.location[0], plant.location[1], 8, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw Herbivores (Blue)
            ctx.fillStyle = "blue";
            ecosystem.creatures
                .filter((c) => c.type === "herbivore")
                .forEach((herbivore) => {
                    ctx.beginPath();
                    ctx.arc(herbivore.location[0], herbivore.location[1], 10, 0, Math.PI * 2);
                    ctx.fill();
                });

            // Draw Predators (Red)
            ctx.fillStyle = "red";
            ecosystem.creatures
                .filter((c) => c.type === "predator")
                .forEach((predator) => {
                    ctx.beginPath();
                    ctx.arc(predator.location[0], predator.location[1], 12, 0, Math.PI * 2);
                    ctx.fill();
                });

            requestAnimationFrame(draw); // Recursively update canvas
        };

        draw(); // Start the animation loop
    }, [ecosystem]); // Re-run effect when ecosystem updates

    return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
};

export default SimulationCanvas;
