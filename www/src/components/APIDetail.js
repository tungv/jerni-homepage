import React from "react";

import CodeFile from "./CodeFile";
import DataType from "./DataType";
import HomeLayout from "./HomeLayout";

export default function APIDetail(props) {
  const { pkg, exp } = props;

  return (
    <HomeLayout
      title={`jerni - API References - Module: ${pkg.pkgName}${exp.path}`}
    >
      <header className="w-full m-auto max-w-6xl">
        <h2 className="text-2xl">
          module:{" "}
          <code className="text-blue-500">
            {pkg.pkgName}
            <b>{exp.path}</b>
          </code>
        </h2>
        {exp.description}
      </header>

      {exp.type === "function" && <FunctionSummary {...exp}></FunctionSummary>}
      {exp.type !== "function" && (
        <div className="w-full m-auto max-w-6xl">
          <header>
            <h3 className="text-2xl">Summary</h3>
            <p>
              type:{" "}
              <code>
                <DataType {...exp}></DataType>
              </code>
            </p>
          </header>
        </div>
      )}

      <section className="w-full m-auto max-w-6xl grid grid-cols-1 gap-4">
        <h3 className="text-2xl">Usages</h3>
        {exp.examples &&
          exp.examples.map((example, index) => (
            <div key={index}>
              <CodeFile language="js">
                {`// ${exp.description}
const ${exp.referredName} = require("${pkg.pkgName}${exp.path}");

${example}`}
              </CodeFile>
            </div>
          ))}
      </section>
    </HomeLayout>
  );
}

function FunctionSummary(props) {
  return (
    <section className="w-full m-auto max-w-6xl grid grid-cols-1 gap-4">
      <header>
        <h3 className="text-2xl">Summary</h3>
        <p>
          type: <code>Function</code>
        </p>
      </header>

      {props.fn.params && (
        <section className="p-2">
          <header>
            <h4 className="font-bold text-lg">Parameters</h4>
          </header>
          {props.fn.params.map((prop) => (
            <section key={prop.name} className="border rounded shadow m-2">
              <header className="bg-gray-200 px-4 py-2">
                <div className="flex flex-row items-center flex-wrap">
                  <h5 className="font-bold">{prop.name}</h5>
                  <code className="mr-4">
                    : <DataType {...prop}></DataType>
                  </code>
                  <p>
                    {prop.optional && "(optional) "}{" "}
                    {prop.description || <em>--</em>}
                  </p>
                </div>
              </header>

              {prop.examples && (
                <div className="p-4 grid grid-cols-1 gap-4">
                  <header>
                    <h6 className="font-bold">Examples</h6>
                  </header>
                  <Examples examples={prop.examples} />
                </div>
              )}
            </section>
          ))}
        </section>
      )}

      {props.fn.returns && (
        <section className="p-2">
          <header>
            <h4 className="font-bold text-lg">returns</h4>
          </header>
          <div className="mx-4 my-2">
            <code>
              <DataType {...props.fn.returns}></DataType>
            </code>
          </div>
        </section>
      )}
    </section>
  );
}
