import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const stepSlideSchema = z.object({
  stepNumber: z.number(),
  stepText: z.string(),
  className: z.string().optional(),
});

type StepSlideProps = z.infer<typeof stepSlideSchema> & {
  children?: React.ReactNode;
  headerStartTime?: number; // seconds
  textStartTime?: number; // seconds
  contentStartTime?: number; // seconds
};

const numberWords = ["one", "two", "three", "four", "five"];

export const StepSlide: React.FC<StepSlideProps> = ({
  stepNumber,
  stepText,
  className,
  children,
  headerStartTime = 0,
  textStartTime = 0.5,
  contentStartTime = 1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerStartFrame = headerStartTime * fps;
  const textStartFrame = textStartTime * fps;
  const contentStartFrame = contentStartTime * fps;

  const headerOpacity = interpolate(frame, [headerStartFrame, headerStartFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [textStartFrame, textStartFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contentOpacity = interpolate(frame, [contentStartFrame, contentStartFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stepWord = numberWords[stepNumber - 1] ?? stepNumber.toString();

  return (
    <AbsoluteFill
      className={`flex flex-col items-start justify-start px-32 pt-24 ${className ?? ""}`}
    >
      <Img
        src={staticFile("gruvbox-bg.png")}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="w-full z-10">
        <h1
          className="text-5xl font-bold text-gruvbox-yellow mb-4 font-mono"
          style={{ opacity: headerOpacity }}
        >
          Step {stepWord}
        </h1>
        <p
          className="text-4xl text-gruvbox-fg leading-relaxed mb-8 font-mono"
          style={{ opacity: textOpacity }}
        >
          {stepText}
        </p>
      </div>
      {children && (
        <div
          className="flex-1 w-full flex items-center justify-center z-10"
          style={{ opacity: contentOpacity }}
        >
          {children}
        </div>
      )}
    </AbsoluteFill>
  );
};
