import { Text } from "@react-three/drei";
import React from "react";

export const Historic = ({ nodes, materials }) => {
  const historics = [
    { missionId: "12", from: "Django", to: "Ownie", value: "0.3 ETH" },
    { missionId: "7", from: "Django", to: "Ownie", value: "0.3 ETH" },
    { missionId: "10", from: "Django", to: "Ownie", value: "0.3 ETH" },
    { missionId: "12", from: "Django", to: "Ownie", value: "0.3 ETH" },
  ];
  return (
    <group name="Historic" position={[-705.41, -106.37, 14.49]}>
      <group name="Group1" position={[0, -93.63, -33.49]}>
        <mesh
          name="Ellipse1"
          geometry={nodes.Ellipse1.geometry}
          material={materials["Mat 4"]}
          skeleton={nodes.Ellipse1.skeleton}
          castShadow
          receiveShadow
          position={[64.94, 0, 0]}
        />
        <mesh
          name="Ellipse2"
          geometry={nodes.Ellipse2.geometry}
          material={materials["Mat 4"]}
          skeleton={nodes.Ellipse2.skeleton}
          castShadow
          receiveShadow
          position={[42.15, 0, 0]}
        />
        <mesh
          name="Ellipse3"
          geometry={nodes.Ellipse3.geometry}
          material={materials["Mat 4"]}
          skeleton={nodes.Ellipse3.skeleton}
          castShadow
          receiveShadow
          position={[20.91, 0, 0]}
        />
        <mesh
          name="Ellipse4"
          geometry={nodes.Ellipse4.geometry}
          material={materials["Ellipse4 Material"]}
          skeleton={nodes.Ellipse4.skeleton}
          castShadow
          receiveShadow
        />
      </group>
      <group name="profile-comp" position={[-87.49, -3.07, -9.43]}>
        <group name="profile-header" position={[27.15, 69.36, 0]}>
          <mesh
            name="Text5"
            geometry={nodes.Text5.geometry}
            material={materials.white}
            skeleton={nodes.Text5.skeleton}
            castShadow
            receiveShadow
            position={[-11.37, -26.49, 0]}
          />
          <mesh
            name="Text6"
            geometry={nodes.Text6.geometry}
            material={materials.white}
            skeleton={nodes.Text6.skeleton}
            castShadow
            receiveShadow
            position={[-55.08, -26.49, 0]}
          />
          <mesh
            name="Text7"
            geometry={nodes.Text7.geometry}
            material={materials.white}
            skeleton={nodes.Text7.skeleton}
            castShadow
            receiveShadow
            position={[227.92, -25.25, 0]}
          />
          <mesh
            name="Text8"
            geometry={nodes.Text8.geometry}
            material={materials.white}
            skeleton={nodes.Text8.skeleton}
            castShadow
            receiveShadow
            position={[121.56, -25.53, 0]}
          />
        </group>
        {historics?.map((historic, index) => (
          <group name="profile-info" position={[27.15, 30 * index - 40, 0]}>
            <group
              name="Crypto Coin"
              position={[182.16, -23.53, -22.96]}
              scale={0.2}
            >
              <mesh
                name="B"
                geometry={nodes.B.geometry}
                material={materials["Mat 5"]}
                skeleton={nodes.B.skeleton}
                castShadow
                receiveShadow
                position={[-17.54, -16.55, -8.48]}
                scale={[1.49, 1.49, 1.87]}
              />
              <mesh
                name="Cylinder4"
                geometry={nodes.Cylinder4.geometry}
                material={materials["Mat 2"]}
                skeleton={nodes.Cylinder4.skeleton}
                castShadow
                receiveShadow
                position={[0, 0, -4.52]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[1, 0.69, 1]}
              />
            </group>
            <Text
              name="missionID"
              position={[-50, -26.49, 0]}
              castShadow
              receiveShadow
              textAlign="right"
              anchorX="right"
              fontSize={11}
              material={materials.white}
              scale={1}
              outlineWidth={0.3}
            >
              #{historic.missionId}
            </Text>
            <Text
              name="mission-value-from"
              position={[20, -26.49, 0]}
              castShadow
              receiveShadow
              anchorX="right"
              fontSize={16}
              material={materials.value}
              scale={1}
              outlineWidth={0.3}
            >
              {historic.from}
            </Text>
            <Text
              name="mission-value-to"
              position={[145, -26.49, 0]}
              castShadow
              receiveShadow
              anchorX="right"
              fontSize={16}
              material={materials.value}
              scale={1}
              outlineWidth={0.3}
            >
              {historic.to}
            </Text>
            <Text
              name="mission-value-to"
              position={[260, -26.49, 0]}
              castShadow
              receiveShadow
              anchorX="right"
              fontSize={16}
              material={materials.value}
              scale={1}
              outlineWidth={0.3}
            >
              {historic.value}
            </Text>

            <group name="arrow" position={[57.13, -25.97, -25.36]} scale={0.2}>
              <mesh
                name="Triangle1"
                geometry={nodes.Triangle1.geometry}
                material={materials.red}
                skeleton={nodes.Triangle1.skeleton}
                castShadow
                receiveShadow
                position={[80.49, 0, 0.79]}
                rotation={[0, 0, -Math.PI / 2]}
              />
              <mesh
                name="Rectangle"
                geometry={nodes.Rectangle.geometry}
                material={materials.red}
                skeleton={nodes.Rectangle.skeleton}
                castShadow
                receiveShadow
                position={[-30.56, -1.31, 0.09]}
              />
            </group>
          </group>
        ))}
      </group>
      <group name="historic-header" position={[-97.23, 72.76, -25.46]}>
        <group name="title-header" position={[34.1, -3.84, 0]}>
          <mesh
            name="Text25"
            geometry={nodes.Text25.geometry}
            material={materials.value}
            skeleton={nodes.Text25.skeleton}
            castShadow
            receiveShadow
            position={[-0.19, 13.9, 0]}
          />
        </group>
      </group>
      <group
        name="purse-obj Instance"
        position={[183.84, 77.34, -40.93]}
        scale={0.3}
      >
        <mesh
          name="¥1"
          geometry={nodes["¥1"].geometry}
          material={materials["Mat 5"]}
          skeleton={nodes["¥1"].skeleton}
          castShadow
          receiveShadow
          position={[-9.58, -26.2, 55.88]}
          rotation={[-0.17, 0.03, 0]}
          scale={2.16}
        />
        <mesh
          name="Torus 21"
          geometry={nodes["Torus 21"].geometry}
          material={materials["Mat 1"]}
          skeleton={nodes["Torus 21"].skeleton}
          castShadow
          receiveShadow
          position={[5.33, 57.85, 2.91]}
          rotation={[-Math.PI / 2, -0.01, 0]}
          scale={1.09}
        />
        <mesh
          name="Torus 31"
          geometry={nodes["Torus 31"].geometry}
          material={materials["Mat 1"]}
          skeleton={nodes["Torus 31"].skeleton}
          castShadow
          receiveShadow
          position={[4.11, 54.15, 1.25]}
          rotation={[-1.66, 0.08, 0.01]}
          scale={1.12}
        />
        <mesh
          name="Torus1"
          geometry={nodes.Torus1.geometry}
          material={materials["Mat 1"]}
          skeleton={nodes.Torus1.skeleton}
          castShadow
          receiveShadow
          position={[3.39, 53.57, 2.91]}
          rotation={[-Math.PI / 2, -0.09, 0]}
          scale={1.09}
        />
        <mesh
          name="Cube4"
          geometry={nodes.Cube4.geometry}
          material={materials["Mat 2"]}
          skeleton={nodes.Cube4.skeleton}
          castShadow
          receiveShadow
          position={[5.22, -9.57, 2.97]}
        />
      </group>
      <mesh
        name="Rectangle 22"
        geometry={nodes["Rectangle 22"].geometry}
        material={materials["Rectangle 22 Material"]}
        skeleton={nodes["Rectangle 22"].skeleton}
        castShadow
        receiveShadow
        position={[34.25, 0, -40.93]}
      />
    </group>
  );
};
