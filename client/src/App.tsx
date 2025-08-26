import { useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { socket } from "./socket";
import { useCanvasStore } from "./store/canvasStore";
import { v4 as uuid } from "uuid";

function App() {
  const {
    rectangles,
    addRectangle,
    moveRectangle,
    setRectangles,
    deleteRectangle,
  } = useCanvasStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    socket.on("init", (rects) => setRectangles(rects));
    socket.on("rectangle:added", (rect) => addRectangle(rect));
    socket.on("rectangle:moved", (rect) => moveRectangle(rect));
    socket.on("rectangle:deleted", (id) => deleteRectangle(id));

    return () => {
      socket.off("init");
      socket.off("rectangle:added");
      socket.off("rectangle:moved");
      socket.off("rectangle:deleted");
    };
  }, []);


  const handleAdd = () => {
    const rect = {
      id: uuid(),
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      color: "red",
    };
    addRectangle(rect);
    socket.emit("rectangle:add", rect);
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteRectangle(selectedId);
      socket.emit("rectangle:delete", selectedId);
      setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Rectangle
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedId}
          className={`px-4 py-2 rounded ${
            selectedId
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Delete Rectangle
        </button>
      </div>

      <Stage width={800} height={600} className="border border-gray-400">
        <Layer>
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
              {...rect}
              fill={rect.color}
              stroke={rect.id === selectedId ? "black" : ""}
              strokeWidth={rect.id === selectedId ? 3 : 0}
              draggable
              onClick={() => setSelectedId(rect.id)}
              onDragMove={(e) => {
                const updated = { ...rect, x: e.target.x(), y: e.target.y() };
                moveRectangle(updated);
                socket.emit("rectangle:move", updated);
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
