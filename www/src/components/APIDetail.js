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
      <header>
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

      <section className="max-w-6xl">
        <h3 className="text-2xl">Usages</h3>
        <div>
          <CodeFile language="js">
            {`// ${exp.description}
const ${exp.referredName} = require("${pkg.pkgName}${exp.path}");

${exp.examples ?? "// no examples"}`}
          </CodeFile>
        </div>
      </section>
    </HomeLayout>
  );
}

function FunctionSummary(props) {
  return (
    <section className="grid grid-cols-1 gap-4">
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
          <div className="mx-4 my-2">
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="bg-gray-700 text-white border p-1">Name</th>
                  <th className="bg-gray-700 text-white border p-1">Type</th>
                  <th className="bg-gray-700 text-white border p-1">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.fn.params.map((param) => (
                  <tr key={param.name}>
                    <td className="border px-4 py-2">{param.name}</td>
                    <td className="border px-4 py-2 font-mono">
                      <DataType {...param}></DataType>
                    </td>
                    <td className="border px-4 py-2 font-serif">
                      {param.description || <em>--</em>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
