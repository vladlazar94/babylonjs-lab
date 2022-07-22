import {
  ArcRotateCamera,
  CubeTexture,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "babylonjs";
import "babylonjs-loaders";
import { createWalkingMan } from "./walking-man";

async function main() {
  const canvas = document.getElementById("RenderCanvas")! as HTMLCanvasElement;
  const { engine, scene } = setupScene(canvas);
  const {} = setupEnvironment(scene);
  const camera = setupCamera(canvas, scene);
  createSkyBox(scene);
  createShapes(scene);

  await createWalkingMan(scene, camera);

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
  // const ground = MeshBuilder.CreateGround(
  //   "Ground",
  //   { width: 1000, height: 1000 },
  //   scene
  // );

  return { light };
}

function setupScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  window.addEventListener("resize", () => engine.resize());

  return { engine, scene };
}

function createSkyBox(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("SkyBox", { size: 10000.0 }, scene);
  const skyboxMaterial = new StandardMaterial("SkyBoxMat", scene);

  skyboxMaterial.reflectionTexture = new CubeTexture(
    "https://www.babylonjs-playground.com/textures/TropicalSunnyDay",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.disableLighting = true;
  skyboxMaterial.backFaceCulling = false;
  skybox.material = skyboxMaterial;
}

function createShapes(scene: Scene) {
  const sphere = MeshBuilder.CreateSphere("Sphere", {}, scene);
  sphere.position = new Vector3(5, 0.5, 0);

  const cube = MeshBuilder.CreateBox("Box", { width: 1, height: 1 }, scene);
  cube.position = new Vector3(-5, 0.5, 0);

  const cyl = MeshBuilder.CreateCylinder("Cyl", {}, scene);
  cyl.position = new Vector3(0, 0.5, 5);

  const knot = MeshBuilder.CreateTorusKnot("Tor", {}, scene);
  knot.position = new Vector3(0, 0, -5);
}
