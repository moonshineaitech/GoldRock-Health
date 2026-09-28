#include <metal_stdlib>
using namespace metal;

// Port of the user-supplied Framer/ChromaticMetal.tsx GLSL, as adapted in web/metal.js.
// Retains nested folded ribbons, the champagne seven-stop ramp, fine brushing,
// edge-limited thin film and the lens rim. No document content passes through it.
static float3 goldrockRamp(float x) {
    const float3 stops[8] = {
        float3(14.0,14.0,13.0)/255.0, float3(241.0,238.0,229.0)/255.0,
        float3(112.0,107.0,95.0)/255.0, float3(36.0,36.0,30.0)/255.0,
        float3(217.0,198.0,160.0)/255.0, float3(250.0,248.0,238.0)/255.0,
        float3(19.0,21.0,17.0)/255.0, float3(19.0,21.0,17.0)/255.0
    };
    float t = fract(x) * 6.0;
    float3 color = stops[0];
    for (int i = 0; i < 7; ++i) {
        color = mix(color, stops[i + 1], smoothstep(0.4, 0.6, clamp(t - float(i), 0.0, 1.0)));
    }
    return color;
}

[[ stitchable ]] half4 goldrockChrome(float2 position, half4 sourceColor, float2 resolution, float time, float scale) {
    const float depth = 0.72, roughness = 0.045, rgbSplit = 0.018;
    const float stretch = 1.85, repeats = 2.0, offset = 0.22, evolution = 0.32;
    float dimension = max(1.0, min(resolution.x, resolution.y));
    float2 pixel = float2(position.x, resolution.y - position.y);
    float2 p = (pixel - 0.5 * resolution) / dimension * 2.0;
    float radius = length(p);
    float angle = 140.0 * 0.01745329252;
    p = float2(cos(angle) * p.x + sin(angle) * p.y, -sin(angle) * p.x + cos(angle) * p.y);
    float z = sqrt(max(0.0, 1.0 - dot(p,p)));
    float2 q = p * float2(1.0, stretch);
    q += depth * float2(sin(q.y*2.4 + sin(time)*evolution), cos(q.x*2.1 + cos(time)*evolution)) * 0.5;
    q += depth * 0.13 * float2(sin(q.y*6.0 + q.x*2.0 + cos(time)*evolution), cos(q.x*5.0 - q.y*2.0 + sin(time)*evolution));
    float flow = q.x + 0.30*sin(q.y*3.0 + sin(time)*evolution) + 0.07*sin(q.y*9.0 - q.x*3.0 + cos(time)*evolution) + z*depth;
    float coord = flow * scale * repeats * 0.5 + offset + sin(time)*evolution*0.2;
    float split = rgbSplit * (0.35 + 0.65*radius);
    float3 color = float3(goldrockRamp(coord+split).r, goldrockRamp(coord).g, goldrockRamp(coord-split).b);
    color += sin(p.y*resolution.y*0.65 + sin(p.x*9.0)) * roughness * 0.06;
    color *= 0.74 + 0.26*z;
    float filmPhase = flow*4.0 + z*3.0 + sin(time)*evolution;
    float3 film = 0.5 + 0.5*cos(float3(0.0,2.1,4.2) + filmPhase);
    float bandEdge = pow(0.5 + 0.5*sin(coord*6.2831853), 12.0);
    color += film * bandEdge * clamp(rgbSplit*1.2, 0.0, 0.08);
    float engraving = sin(flow*clamp(dimension*0.08,6.0,30.0) + sin(q.y*5.0))*0.5+0.5;
    color += engraving * roughness * 0.055;
    color += pow(max(0.0, 1.0-abs(radius-0.96)*28.0),2.0)*0.4;
    float mask = 1.0 - smoothstep(-3.0/dimension, 0.0, radius-1.0);
    float alpha = clamp(mask,0.0,1.0) * float(sourceColor.a);
    return half4(half3(clamp(color,0.0,1.0)*alpha), half(alpha));
}
