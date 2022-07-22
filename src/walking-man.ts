import {
  AbstractMesh,
  AnimationGroup,
  ArcRotateCamera,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from "babylonjs";

export async function createWalkingMan(scene: Scene, camera: ArcRotateCamera) {
  const { character, idle, run } = await importMan(scene);

  enableMoving(character, camera);
  enableMovingAnimation(idle, run);
}

function enableMoving(man: AbstractMesh, camera: ArcRotateCamera) {
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

function enableMovingAnimation(idle: AnimationGroup, move: AnimationGroup) {
  let idleWeight = 1;
  let moveWeight = 0;
  let blendIn: NodeJS.Timer | undefined = undefined;
  let blendOut: NodeJS.Timer | undefined = undefined;

  window.addEventListener("keydown", keydown);

  function keydown(e: KeyboardEvent) {
    if (e.key !== "w") return;
    window.removeEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    if (blendOut !== undefined) clearInterval(blendOut);

    move.start(true);
    move.setWeightForAllAnimatables(moveWeight);
    move.speedRatio = 1.5;

    blendIn = setInterval(() => {
      moveWeight += AnimationBlendingStep;
      idleWeight -= AnimationBlendingStep;
      if (moveWeight >= 1) clearInterval(blendIn);
      move.setWeightForAllAnimatables(moveWeight);
      idle.setWeightForAllAnimatables(idleWeight);
    }, SecondDividedBySixtyInMs);

    function keyup(e: KeyboardEvent) {
      if (e.key !== "w") return;
      window.removeEventListener("keyup", keyup);
      window.addEventListener("keydown", keydown);

      if (blendIn !== undefined) clearInterval(blendIn);

      idle.start(true);
      idle.setWeightForAllAnimatables(idleWeight);

      blendOut = setInterval(() => {
        moveWeight -= AnimationBlendingStep;
        idleWeight += AnimationBlendingStep;
        if (moveWeight <= 0) clearInterval(blendOut);
        move.setWeightForAllAnimatables(moveWeight);
        idle.setWeightForAllAnimatables(idleWeight);
      }, SecondDividedBySixtyInMs);
    }
  }
}

async function importMan(scene: Scene) {
  const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
    "",
    "assets/comix_cat/",
    "scene.gltf",
    scene
  );

  const character = meshes[0]!;
  const idle = animationGroups[2]!;
  const walk = animationGroups[0]!;
  const run = animationGroups[1]!;

  character.scaling = new Vector3(1, 1, 1);
  character.position.y = 0.1;

  const sphere = MeshBuilder.CreateSphere("Sphere", {}, scene);
  sphere.position = new Vector3(5, 0.5, 0);

  walk.stop();
  idle.start();

  return { character, walk, run, idle };
}

const AnimationBlendingStep = 0.2;
const SecondDividedBySixtyInMs = 1000 / 60;
