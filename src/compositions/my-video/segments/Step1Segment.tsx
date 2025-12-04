import { Audio, staticFile } from "remotion";
import { Diagram } from "../../../components/Diagram";
import { StepSlide } from "../../../components/StepSlide";

const mermaidDiagram = `
flowchart LR
    A[📝 Idea] --> B{Complex?}
    B -->|Yes| C[🎨 Diagram]
    B -->|No| D[📄 Text]
    C --> E[✨ Understanding]
    D --> E
`;

export const Step1Segment: React.FC = () => {
  return (
    <>
      <StepSlide
        stepNumber={1}
        stepText="Add some diagrams"
        headerStartTime={0}
        textStartTime={1.52}
        contentStartTime={3.2}
      >
        <Diagram
          type="mermaid"
          diagram={mermaidDiagram}
          theme="dark"
          backgroundColor="transparent"
        />
      </StepSlide>
      <Audio src={staticFile("audio/vo-step1.mp3")} />
    </>
  );
};
