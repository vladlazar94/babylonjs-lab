import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "babylonjs";

const canvas = document.getElementById("RenderCanvas")! as HTMLCanvasElement;
const engine = new Engine(canvas, true);

const scene = new Scene(engine);
const camera = new ArcRotateCamera(
  "Camera",
  Math.PI / 2,
  Math.PI / 3,
  5,
  Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

new HemisphericLight("light", new Vector3(1, 1, 0), scene);

const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
sphere.position.y = 0.5;

MeshBuilder.CreateGround("Ground", { width: 1000, height: 1000 }, scene);

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
