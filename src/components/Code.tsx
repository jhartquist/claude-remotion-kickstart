import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { codeToHtml, type ShikiTransformer } from "shiki";
import { z } from "zod";
import { createLineHighlightTransformer } from "../utils/shiki-transformers";

export const codeSchema = z.object({
	code: z.string(),
	language: z.string(),
	theme: z.string().optional().default("github-dark"),
	showLineNumbers: z.boolean().optional().default(true),
	highlightLines: z.string().optional(),
});

// Use z.input for props (allows optional fields) vs z.infer (output with defaults applied)
type CodeProps = z.input<typeof codeSchema>;

// Helper to generate highlighted HTML for a given configuration
export async function generateHighlightedCode(
	code: string,
	language: string,
	theme: string,
	showLineNumbers: boolean,
	highlightLines?: string
): Promise<string> {
	const transformers: ShikiTransformer[] = [];

	if (showLineNumbers) {
		transformers.push({
			name: "line-numbers",
			line(node, line) {
				node.properties = node.properties || {};
				node.properties["data-line"] = line;
			},
		});
	}

	if (highlightLines) {
		transformers.push(createLineHighlightTransformer(highlightLines));
	}

	return codeToHtml(code, {
		lang: language,
		theme,
		transformers,
	});
}

export const Code: React.FC<CodeProps> = ({
	code,
	language,
	theme = "github-dark",
	showLineNumbers = true,
	highlightLines,
}) => {
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const [handle] = useState(() => delayRender("Loading code syntax highlighting"));

	useEffect(() => {
		generateHighlightedCode(code, language, theme, showLineNumbers, highlightLines)
			.then((html) => {
				setHighlightedCode(html);
				continueRender(handle);
			})
			.catch((err) => {
				cancelRender(err);
			});
	}, [code, language, theme, showLineNumbers, highlightLines, handle]);

	if (!highlightedCode) {
		return null;
	}

	return (
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

				${
					showLineNumbers
						? `
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
				`
						: ""
				}

				/* Line highlighting - flat gray for non-highlighted lines */
				.shiki.has-highlighted .line:not(.highlighted) * {
					color: #666 !important;
				}
			`}</style>
			<div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
		</div>
	);
};
