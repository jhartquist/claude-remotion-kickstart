import { Series, useVideoConfig } from "remotion";
import { IntroSegment } from "./segments/IntroSegment";
import { Step1Segment } from "./segments/Step1Segment";
import { Step2Segment } from "./segments/Step2Segment";
import { Step3Segment } from "./segments/Step3Segment";
import { OutroSegment } from "./segments/OutroSegment";
import { getDurationInFrames } from "../../config";
import {
  INTRO_DURATION_SECONDS,
  STEP1_DURATION_SECONDS,
  STEP2_DURATION_SECONDS,
  STEP3_DURATION_SECONDS,
  OUTRO_DURATION_SECONDS,
} from "./config";
import { createComposition } from "../../utils/createComposition";

const MyVideoComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  const introDuration = getDurationInFrames(INTRO_DURATION_SECONDS, fps);
  const step1Duration = getDurationInFrames(STEP1_DURATION_SECONDS, fps);
  const step2Duration = getDurationInFrames(STEP2_DURATION_SECONDS, fps);
  const step3Duration = getDurationInFrames(STEP3_DURATION_SECONDS, fps);
  const outroDuration = getDurationInFrames(OUTRO_DURATION_SECONDS, fps);

  return (
    <Series>
      <Series.Sequence durationInFrames={introDuration}>
        <IntroSegment />
      </Series.Sequence>
      <Series.Sequence durationInFrames={step1Duration}>
        <Step1Segment />
      </Series.Sequence>
      <Series.Sequence durationInFrames={step2Duration}>
        <Step2Segment />
      </Series.Sequence>
      <Series.Sequence durationInFrames={step3Duration}>
        <Step3Segment />
      </Series.Sequence>
      <Series.Sequence durationInFrames={outroDuration}>
        <OutroSegment />
      </Series.Sequence>
    </Series>
  );
};

const TOTAL_DURATION_SECONDS =
  INTRO_DURATION_SECONDS +
  STEP1_DURATION_SECONDS +
  STEP2_DURATION_SECONDS +
  STEP3_DURATION_SECONDS +
  OUTRO_DURATION_SECONDS;

export const MyVideo = createComposition({
  name: "MyVideo",
  component: MyVideoComposition,
  durationInSeconds: TOTAL_DURATION_SECONDS,
  preset: "Landscape-1080p",
});
