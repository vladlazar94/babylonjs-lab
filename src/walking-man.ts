import { ArcRotateCamera, Scene, SceneLoader, Vector3 } from "babylonjs";

export async function createWalkingMan(scene: Scene, camera: ArcRotateCamera) {
  const { man } = await importMan(scene);

  window.addEventListener("keydown", keydown);

  function keydown(e: KeyboardEvent) {
    if (e.key !== "w") return;
    window.removeEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    const interval = setInterval(() => {
      const displacement = man.position.subtract(camera.position);
      const lookingDirection = man.position.add(
        man.position.subtract(camera.position)
      );
      lookingDirection.y = 0;
      displacement.y = 0;
      displacement.normalize().scaleInPlace(0.1);

      man.moveWithCollisions(displacement);
      man.lookAt(lookingDirection);
      camera.target = man.position;
    }, SecondDividedBySixtyInMs);

    function keyup(e: KeyboardEvent) {
      if (e.key !== "w") return;
      window.removeEventListener("keyup", keyup);
      window.addEventListener("keydown", keydown);

      clearInterval(interval);
    }
  }
}

async function importMan(scene: Scene) {
  const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
    "",
    "assets/walk_cycle/",
    "scene.gltf",
    scene
  );

  const man = meshes[0]!;
  const walk = animationGroups[0]!;

  man.scaling = new Vector3(0.01, 0.01, 0.01);
  walk.stop();

  return { man, walk };
}

const SecondDividedBySixtyInMs = 1000 / 60;
