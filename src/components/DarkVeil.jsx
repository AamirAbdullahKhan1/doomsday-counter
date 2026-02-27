import { useRef, useEffect } from "react";
import * as THREE from "three";

const DarkVeil = ({
    className = "",
    color = "#00ff6a",
    warpAmount = 0.8,
    speed = 2,
    scanlineFrequency = 2.5
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();

        const camera = new THREE.OrthographicCamera(
            -1,
            1,
            1,
            -1,
            0.1,
            10
        );
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uColor: { value: new THREE.Color(color) },
            uWarpAmount: { value: warpAmount },
            uSpeed: { value: speed },
            uScanlineFreq: { value: scanlineFrequency }
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                uniform vec3 uColor;
                uniform float uWarpAmount;
                uniform float uScanlineFreq;
                
                varying vec2 vUv;

                // Hash function
                float hash(vec2 p) {
                    p = fract(p * vec2(123.34, 456.21));
                    p += dot(p, p + 45.32);
                    return fract(p.x * p.y);
                }

                // 2D Noise
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    
                    return mix(
                        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
                        f.y
                    );
                }

                // FBM (Fractal Brownian Motion)
                float fbm(vec2 p) {
                    float f = 0.0;
                    float w = 0.5;
                    for (int i = 0; i < 5; i++) {
                        f += w * noise(p);
                        p *= 2.0;
                        w *= 0.5;
                    }
                    return f;
                }

                void main() {
                    vec2 uv = (vUv - 0.5) * 2.0;
                    uv.x *= uResolution.x / uResolution.y;

                    // Compute warp vectors
                    vec2 q = vec2(
                        fbm(uv + vec2(0.0, 0.0) + uTime * 0.1),
                        fbm(uv + vec2(5.2, 1.3) + uTime * 0.1)
                    );
                    
                    vec2 r = vec2(
                        fbm(uv + 4.0 * q * uWarpAmount + vec2(1.7, 9.2) + uTime * 0.15),
                        fbm(uv + 4.0 * q * uWarpAmount + vec2(8.3, 2.8) + uTime * 0.12)
                    );

                    // Density field
                    float d = fbm(uv + 4.0 * r + uTime * 0.05);

                    // Mix color with shadows
                    vec3 col = mix(
                        vec3(0.01, 0.015, 0.02), // Dark base
                        uColor,
                        d * d * 1.5
                    );
                    
                    // Add bright highlights
                    col += uColor * 0.4 * pow(d, 4.0);

                    // Vignette
                    float dist = length(vUv - 0.5);
                    col *= smoothstep(0.8, 0.2, dist);

                    // Subtle scanlines
                    float scan = sin(vUv.y * uResolution.y * uScanlineFreq) * 0.04;
                    col -= scan;

                    // Overall alpha
                    float alpha = smoothstep(0.1, 0.6, d);
                    
                    gl_FragColor = vec4(col, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let animationFrameId;
        const clock = new THREE.Clock();

        const render = () => {
            uniforms.uTime.value = clock.getElapsedTime() * speed;
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.set(width, height);
        };

        window.addEventListener("resize", handleResize);
        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [color, warpAmount, speed, scanlineFrequency]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
};

export default DarkVeil;
