import { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { generateHighlightedCode } from "./Code";

const animatedHighlightSchema = z.object({
	timeInSeconds: z.number(),
	lines: z.string(),
});

export const codeSlideSchema = z.object({
	title: z.string().optional(),
	code: z.string(),
	language: z.string(),
	theme: z.string().optional().default("github-dark"),
	showLineNumbers: z.boolean().optional().default(true),
	highlightLines: z.string().optional(),
	animatedHighlights: z.array(animatedHighlightSchema).optional(),
	className: z.string().optional(),
});

// Use z.input for props (allows optional fields)
type CodeSlideProps = z.input<typeof codeSlideSchema>;

export const CodeSlide: React.FC<CodeSlideProps> = ({
	title,
	code,
	language,
	theme = "github-dark",
	showLineNumbers = true,
	highlightLines,
	animatedHighlights,
	className,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Collect all unique highlight line configurations that need to be pre-rendered
	const allHighlightConfigs = useMemo(() => {
		const configs: (string | undefined)[] = [highlightLines];
		if (animatedHighlights) {
			for (const h of animatedHighlights) {
				if (!configs.includes(h.lines)) {
					configs.push(h.lines);
				}
			}
		}
		return configs;
	}, [highlightLines, animatedHighlights]);

	// Pre-render all highlight variations upfront
	const [highlightedCodeMap, setHighlightedCodeMap] = useState<Map<string | undefined, string>>(new Map());
	const [handle] = useState(() => delayRender("Pre-rendering code highlight variations"));

	useEffect(() => {
		const renderAll = async () => {
			try {
				const results = await Promise.all(
					allHighlightConfigs.map(async (hl) => {
						const html = await generateHighlightedCode(code, language, theme, showLineNumbers, hl);
						return [hl, html] as const;
					})
				);
				setHighlightedCodeMap(new Map(results));
				continueRender(handle);
			} catch (err) {
				cancelRender(err instanceof Error ? err : new Error(String(err)));
			}
		};
		renderAll();
	}, [code, language, theme, showLineNumbers, allHighlightConfigs, handle]);

	// Calculate current highlight lines based on time
	let currentHighlightLines = highlightLines;

	if (animatedHighlights && animatedHighlights.length > 0) {
		const currentTimeInSeconds = frame / fps;

		// Find the most recent highlight that should be active
		// Sort by time and find the last one that's <= current time
		const activeHighlight = [...animatedHighlights]
			.sort((a, b) => a.timeInSeconds - b.timeInSeconds)
			.reverse()
			.find(h => h.timeInSeconds <= currentTimeInSeconds);

		if (activeHighlight) {
			currentHighlightLines = activeHighlight.lines;
		}
	}

	// Get the pre-rendered HTML for the current highlight configuration
	const currentHtml = highlightedCodeMap.get(currentHighlightLines);

	if (!currentHtml) {
		return null;
	}

	return (
		<AbsoluteFill className={`flex items-center justify-center pb-32 px-16 bg-black ${className ?? ""}`}>
			<div className="w-full max-w-6xl -mt-24">
				{title && (
					<h2 className="text-5xl font-bold mb-8 text-center text-white">{title}</h2>
				)}
				<div className="w-full">
					<style>{`
						.shiki {
							padding: 2rem;
							border-radius: 0.75rem;
							overflow-x: auto;
							font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
							font-size: 1.75rem;
							line-height: 1.6;
						}

						${showLineNumbers ? `
						.shiki code {
							counter-reset: line;
						}

						.shiki code > [data-line]::before {
							counter-increment: line;
							content: counter(line);
							display: inline-block;
							width: 1.5rem;
							margin-right: 1.5rem;
							text-align: right;
							color: rgba(255, 255, 255, 0.3);
						}

						.shiki code > [data-line] {
							padding-left: 0.5rem;
							padding-right: 0.5rem;
						}
						` : ""}

						/* Line highlighting - flat gray for non-highlighted lines */
						.shiki.has-highlighted .line:not(.highlighted) * {
							color: #666 !important;
						}
					`}</style>
					<div dangerouslySetInnerHTML={{ __html: currentHtml }} />
				</div>
			</div>
		</AbsoluteFill>
	);
};
