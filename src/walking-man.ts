import {
  AbstractMesh,
  AnimationGroup,
  ArcRotateCamera,
  Scene,
  SceneLoader,
  Vector3,
} from "babylonjs";

export async function createWalkingMan(scene: Scene, camera: ArcRotateCamera) {
  const { man, walk } = await importMan(scene);

  enableWalking(man, camera);
  enableWalkingAnimation(walk);
}

function enableWalking(man: AbstractMesh, camera: ArcRotateCamera) {
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

function enableWalkingAnimation(walk: AnimationGroup) {
  let animationWeight = 0;
  let increaseInterval: NodeJS.Timer | undefined = undefined;
  let decreaseInterval: NodeJS.Timer | undefined = undefined;

  window.addEventListener("keydown", keydown);

  function keydown(e: KeyboardEvent) {
    if (e.key !== "w") return;
    window.removeEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    if (decreaseInterval !== undefined) clearInterval(decreaseInterval);

    walk.start(true);
    walk.setWeightForAllAnimatables(animationWeight);
    walk.speedRatio = 1.5;

    increaseInterval = setInterval(() => {
      animationWeight += 0.1;
      if (animationWeight >= 1) clearInterval(increaseInterval);
      walk.setWeightForAllAnimatables(animationWeight);
    }, SecondDividedBySixtyInMs);

    function keyup(e: KeyboardEvent) {
      if (e.key !== "w") return;
      window.removeEventListener("keyup", keyup);
      window.addEventListener("keydown", keydown);

      if (increaseInterval !== undefined) clearInterval(increaseInterval);

      decreaseInterval = setInterval(() => {
        animationWeight -= 0.1;
        if (animationWeight <= 0) clearInterval(decreaseInterval);
        walk.setWeightForAllAnimatables(animationWeight);
      }, SecondDividedBySixtyInMs);
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
