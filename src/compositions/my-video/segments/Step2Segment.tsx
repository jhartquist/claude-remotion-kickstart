import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Code } from "../../../components/Code";
import { StepSlide } from "../../../components/StepSlide";

const codeSnippet = `export const StepSlide: React.FC<StepSlideProps> = ({
  stepNumber,
  stepText,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill className="bg-black px-32 pt-24">
      <h1>Step {stepWord}</h1>
      <p>{stepText}</p>
      {children}
    </AbsoluteFill>
  );
};`;

// Timed to voiceover: "Just throw in a code snippet and watch their eyes light up"
const animatedHighlights = [
  { timeInSeconds: 2.5, lines: "1-5" },   // Function signature appears with code
  { timeInSeconds: 4.0, lines: "6-7" },   // Hooks highlighted during "code snippet"
  { timeInSeconds: 5.5, lines: "9-15" },  // JSX highlighted during "eyes light up"
];

export const Step2Segment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the current highlight based on time
  const currentHighlight = [...animatedHighlights]
    .reverse()
    .find((h) => h.timeInSeconds <= currentTime);

  return (
    <>
      <StepSlide
        stepNumber={2}
        stepText="Show some code"
        headerStartTime={0}
        textStartTime={1.2}
        contentStartTime={2.5}
      >
        <div className="w-full max-w-6xl">
          <Code
            code={codeSnippet}
            language="tsx"
            theme="gruvbox-dark-hard"
            highlightLines={currentHighlight?.lines}
          />
        </div>
      </StepSlide>
      <Audio src={staticFile("audio/vo-step2.mp3")} />
    </>
  );
};
