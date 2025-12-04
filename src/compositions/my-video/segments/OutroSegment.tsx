import { Audio, staticFile } from "remotion";
import { TitleSlide } from "../../../components/TitleSlide";

export const OutroSegment: React.FC = () => {
  return (
    <>
      <TitleSlide title="Thanks for watching!" />
      <Audio src={staticFile("audio/vo-outro.mp3")} />
    </>
  );
};
