// src/utils/chart.ts

// Transforma array de valores em string de coordenadas SVG "x,y x,y..."
export function generateChartPath(
  data: number[], 
  width: number, 
  height: number, 
  minOverride?: number, 
  maxOverride?: number
): string {
  if (data.length === 0) return "";
  if (data.length === 1) return `${width / 2},${height / 2}`;

  // Descobre o teto e o piso do gráfico automaticamente
  const min = minOverride ?? Math.min(...data);
  const max = maxOverride ?? Math.max(...data);
  const range = max - min || 1; // Evita divisão por zero

  return data.map((val, index) => {
    const ratioX = index / (data.length - 1);
    const x = ratioX * width;

    // Normaliza o valor Y (0 a 1) e inverte (porque no SVG o Y=0 é o topo)
    const clampedVal = Math.min(max, Math.max(min, val));
    const normalizedY = (clampedVal - min) / range;
    const y = height - (normalizedY * height);

    return `${x},${y}`;
  }).join(" ");
}