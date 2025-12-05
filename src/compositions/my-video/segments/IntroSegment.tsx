import { Audio, staticFile } from "remotion";
import { TitleSlide } from "../../../components/TitleSlide";

export const IntroSegment: React.FC = () => {
  return (
    <>
      <TitleSlide title="How to Explain Things to Programmers" />
      <Audio src={staticFile("audio/vo-intro.mp3")} />
    </>
  );
};
