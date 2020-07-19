import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";

export default function CodeFile(props) {
  const { fileName, code, children, language = "jsx" } = props;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg text-xs sm:text-sm md:text-md">
      {fileName && (
        <header>
          <h6 className="bg-black text-white py-1 px-3 border-b-2 border-green-300 flex items-center">
            <span className="text-gray-300 font-mono text-sm mr-1">file: </span>
            <code>{fileName}</code>
          </h6>
        </header>
      )}

      <Highlight
        {...defaultProps}
        theme={theme}
        code={(code || children).trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={style}
            className="p-2 overflow-auto"
          >
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
