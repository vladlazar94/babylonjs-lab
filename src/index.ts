import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from "babylonjs";
import "babylonjs-loaders";

async function main() {
  const canvas = document.getElementById("RenderCanvas")! as HTMLCanvasElement;
  const { engine, scene } = setupScene(canvas);
  const {} = setupEnvironment(scene);
  setupCamera(canvas, scene);

  await importMan(scene);

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
}

async function importMan(scene: Scene) {
  const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
    "",
    "/assets/walk_cycle/",
    "scene.gltf",
    scene
  );

  const man = meshes[0]!;
  const walk = animationGroups[0]!;

  man.scaling = new Vector3(0.01, 0.01, 0.01);
  walk.stop();

  return { man, walk };
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
