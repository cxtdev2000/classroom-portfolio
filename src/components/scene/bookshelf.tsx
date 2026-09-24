"use client";

import { createRandom } from "./canvas-texture";
import { palette, pastelCycle } from "./palette";
import { Plant } from "./small-props";

const WIDTH = 1.4;
const HEIGHT = 1.9;
const DEPTH = 0.36;
const shelfLevels = [0.06, 0.52, 0.98, 1.44];

type ShelfBook = { x: number; y: number; width: number; height: number; color: string; lean: number };

// Precomputed book layout (deterministic so it stays identical between renders).
const books: ShelfBook[] = (() => {
  const random = createRandom(42);
  const result: ShelfBook[] = [];
  shelfLevels.slice(0, 3).forEach((level, shelf) => {
    let x = -WIDTH / 2 + 0.08;
    const limit = WIDTH / 2 - (shelf === 1 ? 0.35 : 0.1);
    let index = 0;
    while (x < limit) {
      const width = 0.05 + random() * 0.04;
      const height = 0.26 + random() * 0.12;
      const lean = index > 0 && random() > 0.85 ? -0.25 : 0;
      result.push({ x: x + width / 2, y: level + 0.02, width, height, color: pastelCycle[(shelf * 3 + index) % pastelCycle.length], lean });
      x += width + 0.008 + (lean ? 0.05 : 0);
      index++;
    }
  });
  return result;
})();

/** Open shelf of colorful books with an abacus and a plant on top. Faces +Z. */
export function Bookshelf({ position }: { position: [number, number, number] }) {
  const panel = palette.paper;
  return (
    <group position={position}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (WIDTH / 2 - 0.02), HEIGHT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.04, HEIGHT, DEPTH]} />
          <meshStandardMaterial color={panel} />
        </mesh>
      ))}
      <mesh position={[0, HEIGHT / 2, -DEPTH / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[WIDTH, HEIGHT, 0.02]} />
        <meshStandardMaterial color={palette.sky} />
      </mesh>
      {[...shelfLevels, HEIGHT - 0.02].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[WIDTH, 0.04, DEPTH]} />
          <meshStandardMaterial color={panel} />
        </mesh>
      ))}

      {books.map((book, index) => (
        <mesh
          key={index}
          position={[book.x, book.y + book.height / 2, 0.02]}
          rotation={[0, 0, book.lean]}
          castShadow
        >
          <boxGeometry args={[book.width, book.height, 0.24]} />
          <meshStandardMaterial color={book.color} />
        </mesh>
      ))}

      {/* Rolled certificates tied with a ribbon */}
      <group position={[0.45, shelfLevels[1] + 0.02, 0.02]}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} position={[index * 0.05 - 0.05, 0.03 + (index === 1 ? 0.05 : 0), 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.2, 12]} />
            <meshStandardMaterial color={index === 1 ? palette.paper : "#fff1c9"} />
          </mesh>
        ))}
        <mesh position={[0, 0.055, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.052, 0.008, 6, 20]} />
          <meshStandardMaterial color={palette.berry} />
        </mesh>
      </group>

      <Abacus position={[-0.3, HEIGHT, 0]} />
      <Plant position={[0.4, HEIGHT, 0]} scale={0.7} potColor={palette.sunny} />
    </group>
  );
}

const beadColors = [palette.berry, palette.sunny, palette.sky, palette.leaf];

function Abacus({ position }: { position: [number, number, number] }) {
  const width = 0.5;
  const height = 0.36;
  return (
    <group position={position}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2), height / 2, 0]} castShadow>
          <boxGeometry args={[0.03, height, 0.08]} />
          <meshStandardMaterial color={palette.wood} />
        </mesh>
      ))}
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[width + 0.1, 0.03, 0.12]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width + 0.03, 0.03, 0.08]} />
        <meshStandardMaterial color={palette.wood} />
      </mesh>
      {beadColors.map((color, row) => {
        const y = 0.08 + row * 0.07;
        return (
          <group key={color} position={[0, y, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.004, 0.004, width, 6]} />
              <meshStandardMaterial color={palette.graphite} />
            </mesh>
            {Array.from({ length: 5 }, (_, bead) => (
              <mesh key={bead} position={[-width / 2 + 0.05 + bead * 0.045 + (bead >= 5 - row ? 0.14 : 0), 0, 0]} scale={[0.7, 1, 1]}>
                <sphereGeometry args={[0.028, 14, 10]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
