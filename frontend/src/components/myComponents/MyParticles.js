import React, { useEffect } from "react";

export const Particle = ({ style }) => {
  useEffect(() => {
    // Le code Particle.js original va ici, sans utiliser Particles.init

    // Mettez simplement votre code Particle.js ici
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: false, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: { enable: true, speed: 1, opacity_min: 0.01, sync: false },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: true, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse", // Activer le mode "repulse" au survol
          },

          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  }, []);

  return (
    <div className={style || " absolute z-1 "}>
      <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>

      <script src="https://threejs.org/examples/js/libs/stats.min.js"></script>
      <div id="particles-js"></div>
    </div>
  );
};
