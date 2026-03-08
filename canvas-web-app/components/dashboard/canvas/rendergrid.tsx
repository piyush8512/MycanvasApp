import { useCanvasStore } from "@/stores";

import { GRID_SIZE } from "@/types/canvas";

const RenderGrid = () => {
  const { zoom, pan } = useCanvasStore();
  const gridSpacing = GRID_SIZE * zoom;
  const offsetX = pan.x % gridSpacing;
  const offsetY = pan.y % gridSpacing;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <pattern
          id="grid-dots"
          width={gridSpacing}
          height={gridSpacing}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <circle
            cx={gridSpacing / 2}
            cy={gridSpacing / 2}
            r="1.5"
            fill="var(--grid-color)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-dots)" />
    </svg>
  );
};

export default RenderGrid;
