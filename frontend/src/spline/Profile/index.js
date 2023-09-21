import { Text } from "@react-three/drei";
import React from "react";

export const Profile = ({ user, nodes, materials }) => {
  return (
    <group name="profile-product" position={[-705.41, 157.95, 14.49]}>
      <group name="profile-comp2" position={[-87.49, -3.07, 1.15]}>
        <group name="profile-info-posts" position={[27.15, -50, 0]}>
          <mesh
            name="Text26"
            geometry={nodes.Text26.geometry}
            material={materials.white}
            skeleton={nodes.Text26.skeleton}
            castShadow
            receiveShadow
            position={[81.37, -6.48, 0]}
          />

          <Text
            name="post-value"
            anchorX="left"
            textAlign="left"
            material={materials.value}
            position={[-71, -28, 0]}
            scale={1}
            fontSize={20}
            outlineWidth={0.3}
          >
            {user?.posts?.length}
          </Text>
        </group>
        <group name="profile-info-mission" position={[27.15, -10, 0]}>
          <mesh
            name="Text27"
            geometry={nodes.Text27.geometry}
            material={materials.white}
            skeleton={nodes.Text27.skeleton}
            castShadow
            receiveShadow
            position={[81.37, -6.48, 0]}
          />
          <Text
            name="mission-value"
            anchorX="left"
            textAlign="left"
            material={materials.value}
            scale={1}
            fontSize={20}
            outlineWidth={0.3}
            position={[-71, -28, 0]}
          >
            {user?.missions?.length} / {user?.features?.length}
          </Text>
        </group>
        <group name="profile-info-launchpad" position={[27.15, 30, 0]}>
          <mesh
            name="Text28"
            geometry={nodes.Text28.geometry}
            material={materials.white}
            skeleton={nodes.Text28.skeleton}
            castShadow
            receiveShadow
            position={[81.37, -6.48, 0]}
          />
          <Text
            name="launchpad-value"
            anchorX="left"
            textAlign="left"
            material={materials.value}
            scale={1}
            fontSize={20}
            outlineWidth={0.3}
            position={[-71, -28, 0]}
          >
            {user?.launchpad?.length} / 0
          </Text>
        </group>
      </group>
      <group name="profile-header1" position={[-22.76, 72.76, -25.46]}>
        <group name="profile-info5" position={[34.1, -3.84, 0]}>
          <Text
            name="profile-info-name"
            material={materials.value}
            fontSize={20}
            outlineWidth={0.3}
            castShadow
            textAlign="left"
            anchorX={"right"}
            maxWidth={100}
            receiveShadow
            position={[10, 13.9, 0]}
          >
            {/* {user?.name} */}
            Django
          </Text>
          <Text
            name="profile-info-date"
            material={materials.white}
            scale={1}
            fontSize={12}
            // outlineWidth={0.3}
            castShadow
            receiveShadow
            position={[-16, -10, 0]}
          >
            Depuis le 03.12.2022
          </Text>
        </group>
        <group name="profile-obj" position={[-76.67, 0, 0]} scale={0.4}>
          <mesh
            name="Cube 4"
            geometry={nodes["Cube 4"].geometry}
            material={materials["Mat 1"]}
            skeleton={nodes["Cube 4"].skeleton}
            castShadow
            receiveShadow
            position={[-0.32, -6.22, 18.45]}
          />
          <mesh
            name="Cube 3"
            geometry={nodes["Cube 3"].geometry}
            material={materials["Mat 3"]}
            skeleton={nodes["Cube 3"].skeleton}
            castShadow
            receiveShadow
            position={[-0.32, -10.84, 18.45]}
          />
          <mesh
            name="Shape2"
            geometry={nodes.Shape2.geometry}
            material={materials["Mat 2"]}
            skeleton={nodes.Shape2.skeleton}
            castShadow
            receiveShadow
            position={[-24.13, 53.56, -7.34]}
          />
          <mesh
            name="Cube 21"
            geometry={nodes["Cube 21"].geometry}
            material={materials["Mat 3"]}
            skeleton={nodes["Cube 21"].skeleton}
            castShadow
            receiveShadow
            position={[0.15, 20.7, -15.45]}
            scale={[1, 1.46, 1]}
          />
          <mesh
            name="Cube5"
            geometry={nodes.Cube5.geometry}
            material={materials["Mat 1"]}
            skeleton={nodes.Cube5.skeleton}
            castShadow
            receiveShadow
            position={[0.15, -15.59, -4.62]}
            scale={[1, 1.46, 1]}
          />
        </group>
      </group>
      <mesh
        name="Rectangle 23"
        geometry={nodes["Rectangle 23"].geometry}
        material={materials["Rectangle 23 Material"]}
        skeleton={nodes["Rectangle 23"].skeleton}
        castShadow
        receiveShadow
        position={[34.25, 0, -40.93]}
      />
    </group>
  );
};
