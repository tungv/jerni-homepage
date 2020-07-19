import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import { Fragment } from "react";

export default function CodeFile(props) {
  const {
    fileName,
    code,
    children,
    language = "jsx",
    result,
    outputLanguage,
  } = props;

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

      {language === "text" && (
        <pre
          style={{
            background: theme.plain.backgroundColor,
            color: theme.plain.color,
          }}
          className="p-2 overflow-auto"
        >
          {React.Children.toArray(children).map((line, index) => {
            return (
              <div
                className="token-line mr-1"
                key={index}
                style={{ color: theme.plain.color }}
              >
                <span className="token plain">{line}</span>
              </div>
            );
          })}
        </pre>
      )}

      {language !== "text" && (
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
      )}
      {result && (
        <Fragment>
          <h3 className="bg-green-500 text-white px-2 py-1">Output</h3>
          <Highlight
            {...defaultProps}
            theme={theme}
            code={result.trim()}
            language={outputLanguage || language}
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
        </Fragment>
      )}
    </div>
  );
}
