import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "babylonjs";
import "babylonjs-loaders";
import { createWalkingMan } from "./walking-man";

async function main() {
  const canvas = document.getElementById("RenderCanvas")! as HTMLCanvasElement;
  const { engine, scene } = setupScene(canvas);
  const {} = setupEnvironment(scene);
  const camera = setupCamera(canvas, scene);

  await createWalkingMan(scene, camera);

  const sphere = MeshBuilder.CreateSphere("Sphere", {}, scene);
  sphere.position = new Vector3(5, 0.5, 0);

  engine.runRenderLoop(() => scene.render());
}

main();

function setupCamera(canvas: HTMLCanvasElement, scene: Scene) {
  const camera = new ArcRotateCamera(
    "Camera",
    Math.PI / 2,
    Math.PI / 3,
    5,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  camera.lowerBetaLimit = Math.PI / 6;
  camera.upperBetaLimit = Math.PI / 2.3;
  return camera;
}

function setupEnvironment(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
  const ground = MeshBuilder.CreateGround(
    "Ground",
    { width: 1000, height: 1000 },
    scene
  );

  return { light, ground };
}

function setupScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  window.addEventListener("resize", () => engine.resize());

  return { engine, scene };
}
