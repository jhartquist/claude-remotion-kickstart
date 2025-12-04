import { Audio, Video, staticFile } from "remotion";
import { StepSlide } from "../../../components/StepSlide";

export const Step3Segment: React.FC = () => {
  return (
    <>
      <StepSlide
        stepNumber={3}
        stepText="Sprinkle in some AI"
        headerStartTime={0}
        textStartTime={1.52}
        contentStartTime={3.0}
      >
        <div className="w-full h-full max-w-5xl max-h-[500px] rounded-lg overflow-hidden">
          <Video
            src={staticFile("ai-visualization.mp4")}
            className="w-full h-full object-cover"
            volume={0}
            playbackRate={0.65}
          />
        </div>
      </StepSlide>
      <Audio src={staticFile("audio/vo-step3.mp3")} />
    </>
  );
};
