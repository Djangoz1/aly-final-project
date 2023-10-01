/*
  Auto-generated by Spline
*/

import useSpline from "@splinetool/r3f-spline";
import { Center, OrthographicCamera, Text } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Profile } from "spline/Profile";
import { Historic } from "spline/Historic";
export const ProfileScene = ({ ...props }) => {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/ODF2boPDENgupRUX/scene.splinecode"
  );

  const tess = useRef();
  const user = {
    name: "John Doe",
    posts: [1],
    missions: [1, 3, 4],
    features: [1, 4],
    launchpad: [1],
  };
  useEffect(() => {
    if (tess.current) {
      tess.current.userData.text = "Nouveau texte"; // Change the text here
    }
  }, []);

  return (
    <>
      <color attach="background" args={["#74757a"]} />
      <group {...props} dispose={null}>
        <scene name="Scene 1">
          <group name="Phone" position={[335.71, -94.16, 38.37]}>
            <group name="launchpad-btn" position={[-324.98, -103.58, 3.52]}>
              <group name="Button Instance" position={[133.26, -88.43, -36.99]}>
                <group name="Container1" position={[0, 0, -3.28]}>
                  <mesh
                    name="Text3"
                    geometry={nodes.Text3.geometry}
                    material={materials["Text3 Material"]}
                    skeleton={nodes.Text3.skeleton}
                    castShadow
                    receiveShadow
                    position={[0, -2.55, 6.5]}
                  />
                  <mesh
                    name="Button BG3"
                    geometry={nodes["Button BG3"].geometry}
                    material={materials.White}
                    skeleton={nodes["Button BG3"].skeleton}
                    castShadow
                    receiveShadow
                    position={[0, 0, -6.5]}
                  />
                </group>
              </group>
              <group
                name="Rocket"
                position={[-4.15, 2.72, -0.5]}
                rotation={[0, -0.12, -0.39]}
                scale={0.77}
              >
                <mesh
                  name="Up"
                  geometry={nodes.Up.geometry}
                  material={materials["Mat 1"]}
                  skeleton={nodes.Up.skeleton}
                  castShadow
                  receiveShadow
                  position={[-0.38, 17.49, -4.98]}
                  rotation={[0, 0, 0.03]}
                  scale={0.37}
                />
                <group
                  name="Component Instance"
                  position={[-0.04, 47.73, 45.55]}
                  rotation={[-0.22, 0, 0]}
                  scale={0.48}
                >
                  <mesh
                    name="Cylinder 22"
                    geometry={nodes["Cylinder 22"].geometry}
                    material={materials["blue-light"]}
                    skeleton={nodes["Cylinder 22"].skeleton}
                    castShadow
                    receiveShadow
                    position={[0.01, -0.35, 4.36]}
                    rotation={[1.61, 0.03, 0]}
                    scale={[0.71, 0.34, 0.71]}
                  />
                  <mesh
                    name="Cylinder1"
                    geometry={nodes.Cylinder1.geometry}
                    material={materials["Mat 2"]}
                    skeleton={nodes.Cylinder1.skeleton}
                    castShadow
                    receiveShadow
                    position={[0, 0, -5.6]}
                    rotation={[1.61, 0.03, 0]}
                    scale={[0.89, 1, 0.89]}
                  />
                </group>
                <group
                  name="Component Instance1"
                  position={[-0.04, 2.75, 47.44]}
                  scale={0.48}
                >
                  <mesh
                    name="Cylinder 23"
                    geometry={nodes["Cylinder 23"].geometry}
                    material={materials["blue-light"]}
                    skeleton={nodes["Cylinder 23"].skeleton}
                    castShadow
                    receiveShadow
                    position={[0.01, -0.35, 4.36]}
                    rotation={[1.61, 0.03, 0]}
                    scale={[0.71, 0.34, 0.71]}
                  />
                  <mesh
                    name="Cylinder2"
                    geometry={nodes.Cylinder2.geometry}
                    material={materials["Mat 2"]}
                    skeleton={nodes.Cylinder2.skeleton}
                    castShadow
                    receiveShadow
                    position={[0, 0, -5.6]}
                    rotation={[1.61, 0.03, 0]}
                    scale={[0.89, 1, 0.89]}
                  />
                </group>
                <mesh
                  name="Body White"
                  geometry={nodes["Body White"].geometry}
                  material={materials["Mat 3"]}
                  skeleton={nodes["Body White"].skeleton}
                  castShadow
                  receiveShadow
                  position={[-0.36, 17.22, -4.71]}
                  rotation={[0, 0, 0.03]}
                  scale={0.39}
                />
                <group name="Group" position={[-2, -11.79, 0.84]} scale={0.48}>
                  <mesh
                    name="Shape"
                    geometry={nodes.Shape.geometry}
                    material={materials[""]}
                    skeleton={nodes.Shape.skeleton}
                    castShadow
                    receiveShadow
                    position={[91.88, 14.97, 35.66]}
                    rotation={[0.02, -0.47, -0.69]}
                    scale={[0.34, 0.32, 0.28]}
                  />
                </group>
                <mesh
                  name="bottom"
                  geometry={nodes.bottom.geometry}
                  material={materials["Mat 2"]}
                  skeleton={nodes.bottom.skeleton}
                  castShadow
                  receiveShadow
                  position={[1.31, -36.27, -4.08]}
                  rotation={[0, 0, 0.03]}
                  scale={0.38}
                />
                <mesh
                  name="Engine"
                  geometry={nodes.Engine.geometry}
                  material={materials["Mat 5"]}
                  skeleton={nodes.Engine.skeleton}
                  castShadow
                  receiveShadow
                  position={[1.11, -42.75, -4.07]}
                  rotation={[Math.PI / 2, 0.03, 0]}
                  scale={[0.41, 0.41, 0.81]}
                />
                <mesh
                  name="Fire_Red"
                  geometry={nodes.Fire_Red.geometry}
                  material={materials["Mat 5"]}
                  skeleton={nodes.Fire_Red.skeleton}
                  castShadow
                  receiveShadow
                  position={[2.51, -75.13, -4.31]}
                  rotation={[0, 0, 0.03]}
                  scale={[0.32, 0.41, 0.32]}
                />
              </group>
              <mesh
                name="Rectangle 3"
                geometry={nodes["Rectangle 3"].geometry}
                material={materials["Mat 6"]}
                skeleton={nodes["Rectangle 3"].skeleton}
                castShadow
                receiveShadow
                position={[0, -1.96, -41.79]}
              />
            </group>
            <group name="settings-btn" position={[0, -94.94, 15.35]}>
              <group
                name="settings-obj"
                position={[0, 49.03, -33.52]}
                rotation={[0, 0, 0]}
                scale={[0.6, 0.6, 0.4]}
              >
                <mesh
                  name="Cube2"
                  geometry={nodes.Cube2.geometry}
                  material={materials["Mat 2"]}
                  skeleton={nodes.Cube2.skeleton}
                  castShadow
                  receiveShadow
                  position={[26.16, 21.03, -8.61]}
                  rotation={[0, 0, -0.7]}
                  scale={1}
                />
                <group name="Group 82" position={[-9.98, -67.64, 3.11]}>
                  <mesh
                    name="Rectangle 31"
                    geometry={nodes["Rectangle 31"].geometry}
                    material={materials["Mat 1"]}
                    skeleton={nodes["Rectangle 31"].skeleton}
                    castShadow
                    receiveShadow
                    position={[11.63, -0.06, 2.82]}
                    rotation={[0, 0, -0.26]}
                    scale={1}
                  />
                  <mesh
                    name="Ellipse"
                    geometry={nodes.Ellipse.geometry}
                    material={materials["Mat 3"]}
                    skeleton={nodes.Ellipse.skeleton}
                    castShadow
                    receiveShadow
                    position={[14.29, -0.99, 2.63]}
                  />
                  <mesh
                    name="Rectangle 2"
                    geometry={nodes["Rectangle 2"].geometry}
                    material={materials["Mat 3"]}
                    skeleton={nodes["Rectangle 2"].skeleton}
                    castShadow
                    receiveShadow
                    position={[-38.88, 12.83, -1.52]}
                    rotation={[0, 0, -0.26]}
                    scale={1}
                  />
                  <mesh
                    name="Shape1"
                    geometry={nodes.Shape1.geometry}
                    material={materials["Mat 2"]}
                    skeleton={nodes.Shape1.skeleton}
                    castShadow
                    receiveShadow
                    position={[-31.79, 18.95, -4.63]}
                  />
                </group>
                <group name="Group 81" position={[-20.53, -6.31, 2.01]}>
                  <mesh
                    name="Triangle"
                    geometry={nodes.Triangle.geometry}
                    material={materials["Mat 4"]}
                    skeleton={nodes.Triangle.skeleton}
                    castShadow
                    receiveShadow
                    position={[-60.96, 42.61, -2.09]}
                    rotation={[0, 0, 0.87]}
                    scale={1}
                  />
                  <mesh
                    name="Cylinder3"
                    geometry={nodes.Cylinder3.geometry}
                    material={materials["Mat 4"]}
                    skeleton={nodes.Cylinder3.skeleton}
                    castShadow
                    receiveShadow
                    position={[-27.08, 20.16, -0.09]}
                    rotation={[0, 0, 1]}
                    scale={1}
                  />
                  <mesh
                    name="Cube 2"
                    geometry={nodes["Cube 2"].geometry}
                    material={materials["Mat 2"]}
                    skeleton={nodes["Cube 2"].skeleton}
                    castShadow
                    receiveShadow
                    position={[45, -28.43, 0]}
                    rotation={[0, 0, -0.61]}
                    scale={1}
                  />
                </group>
              </group>
              <mesh
                name="Rectangle 32"
                geometry={nodes["Rectangle 32"].geometry}
                material={materials.white}
                skeleton={nodes["Rectangle 32"].skeleton}
                castShadow
                receiveShadow
                position={[0, 50.04, -41.79]}
                scale={[1, 0.5, 1]}
              />
            </group>
            <group name="msg-btn" position={[0, -216.22, 15.35]}>
              <group name="Button Instance1" position={[130.31, 22.07, -9.5]}>
                <group name="Container2" position={[0, 0, -3.28]}>
                  <mesh
                    name="Text4"
                    geometry={nodes.Text4.geometry}
                    material={materials["Text4 Material"]}
                    skeleton={nodes.Text4.skeleton}
                    castShadow
                    receiveShadow
                    position={[0, -2.55, 6.5]}
                  />
                  <mesh
                    name="Button BG4"
                    geometry={nodes["Button BG4"].geometry}
                    material={materials.White}
                    skeleton={nodes["Button BG4"].skeleton}
                    castShadow
                    receiveShadow
                    position={[0, 0, -6.5]}
                  />
                </group>
              </group>
              <group
                name="msg-obj"
                position={[0, 49.03, -33.52]}
                rotation={[0, 0, 0]}
                scale={[0.6, 0.6, 0.4]}
              >
                <mesh
                  name="Rectangle 4"
                  geometry={nodes["Rectangle 4"].geometry}
                  material={materials["Mat 3"]}
                  skeleton={nodes["Rectangle 4"].skeleton}
                  castShadow
                  receiveShadow
                  position={[-1.69, -0.15, 1.36]}
                />
                <mesh
                  name="Rectangle 33"
                  geometry={nodes["Rectangle 33"].geometry}
                  material={materials["Mat 3"]}
                  skeleton={nodes["Rectangle 33"].skeleton}
                  castShadow
                  receiveShadow
                  position={[-1.69, 13.32, 1.36]}
                />
                <mesh
                  name="Rectangle 21"
                  geometry={nodes["Rectangle 21"].geometry}
                  material={materials["Mat 4"]}
                  skeleton={nodes["Rectangle 21"].skeleton}
                  castShadow
                  receiveShadow
                  position={[-1.17, -7.23, -2.83]}
                />
                <mesh
                  name="Cube3"
                  geometry={nodes.Cube3.geometry}
                  material={materials["Mat 2"]}
                  skeleton={nodes.Cube3.skeleton}
                  castShadow
                  receiveShadow
                  position={[0, -26.63, 10.74]}
                />
              </group>
              <mesh
                name="Rectangle 34"
                geometry={nodes["Rectangle 34"].geometry}
                material={materials["Mat 6"]}
                skeleton={nodes["Rectangle 34"].skeleton}
                castShadow
                receiveShadow
                position={[0, 50.04, -41.79]}
                scale={[1, 0.5, 1]}
              />
            </group>
            <Historic nodes={nodes} materials={materials} />
            <Profile user={user} nodes={nodes} materials={materials} />
            <group
              name="Icon Instance"
              position={[128.44, 304.22, -40.96]}
              scale={0.3}
            >
              <mesh
                name="Cylinder 42"
                geometry={nodes["Cylinder 42"].geometry}
                material={materials["Mat 1"]}
                skeleton={nodes["Cylinder 42"].skeleton}
                castShadow
                receiveShadow
                position={[30.09, -45.62, -23.32]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.73, 0.41, 0.73]}
              />
              <mesh
                name="Cylinder 31"
                geometry={nodes["Cylinder 31"].geometry}
                material={materials["Mat 1"]}
                skeleton={nodes["Cylinder 31"].skeleton}
                castShadow
                receiveShadow
                position={[30.09, -45.62, 22.28]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.73, 0.41, 0.73]}
              />
              <mesh
                name="Cylinder 43"
                geometry={nodes["Cylinder 43"].geometry}
                material={materials["Mat 1"]}
                skeleton={nodes["Cylinder 43"].skeleton}
                castShadow
                receiveShadow
                position={[-14.08, -45.62, -23.32]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.73, 0.41, 0.73]}
              />
              <mesh
                name="Cylinder 24"
                geometry={nodes["Cylinder 24"].geometry}
                material={materials["Mat 1"]}
                skeleton={nodes["Cylinder 24"].skeleton}
                castShadow
                receiveShadow
                position={[-14.08, -45.62, 22.28]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.73, 0.41, 0.73]}
              />
              <mesh
                name="Cube6"
                geometry={nodes.Cube6.geometry}
                material={materials.Blue}
                skeleton={nodes.Cube6.skeleton}
                castShadow
                receiveShadow
                position={[-22.34, 5.25, -5.2]}
                scale={0.73}
              />
            </group>
            <group name="Button Shopping" position={[0.61, -289.45, -23.17]}>
              <group name="Base_Button Instance1" position={[0, 0, 4.98]}>
                <group name="container2" position={[0, 0, -9.96]}>
                  <mesh
                    name="Text29"
                    geometry={nodes.Text29.geometry}
                    material={materials["Untitled Material"]}
                    skeleton={nodes.Text29.skeleton}
                    castShadow
                    receiveShadow
                    position={[0, -2.55, 13.18]}
                  />
                  <mesh
                    name="Button BG5"
                    geometry={nodes["Button BG5"].geometry}
                    material={materials.Blue}
                    skeleton={nodes["Button BG5"].skeleton}
                    castShadow
                    receiveShadow
                    position={[0, 0, 0.18]}
                  />
                </group>
              </group>
            </group>
            <mesh
              name="Title"
              geometry={nodes.Title.geometry}
              material={materials["Title Material"]}
              skeleton={nodes.Title.skeleton}
              castShadow
              receiveShadow
              position={[-799.28, 298.47, -25.19]}
            />
            <mesh
              name="Background"
              geometry={nodes.Background.geometry}
              material={materials["Background Material"]}
              skeleton={nodes.Background.skeleton}
              castShadow
              receiveShadow
              position={[-361.08, 0, -51.66]}
              rotation={[-Math.PI, 0, -Math.PI]}
              scale={[-1, 1, 1]}
            />
          </group>
          <directionalLight
            name="Directional Light 2"
            castShadow
            intensity={2}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={-10000}
            shadow-camera-far={100000}
            shadow-camera-left={-1000}
            shadow-camera-right={1000}
            shadow-camera-top={1000}
            shadow-camera-bottom={-1000}
            position={[0, 100, 300]}
          />
          <OrthographicCamera
            name="1"
            makeDefault={true}
            far={10000}
            near={-50000}
          />
          <hemisphereLight
            name="Default Ambient Light"
            intensity={0.75}
            color="#eaeaea"
          />
        </scene>
      </group>
    </>
  );
};