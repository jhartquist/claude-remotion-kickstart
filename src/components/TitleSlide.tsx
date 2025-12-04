import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";

export const titleSlideSchema = z.object({
  title: z.string(),
  className: z.string().optional(),
});

type TitleSlideProps = z.infer<typeof titleSlideSchema>;

export const TitleSlide: React.FC<TitleSlideProps> = ({ title, className }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className={`flex items-center justify-center ${className ?? ""}`}>
      <Img
        src={staticFile("gruvbox-bg.png")}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="text-6xl font-bold text-gruvbox-fg font-mono text-center px-16 z-10"
        style={{
          opacity,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
