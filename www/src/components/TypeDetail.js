import React, { Fragment } from "react";

import CodeFile from "./CodeFile";
import DataType from "./DataType";
import HomeLayout from "./HomeLayout";
import Link from "next/link";

export default function TypeDetail(props) {
  const { pkg, type } = props;
  return (
    <HomeLayout title={`jerni - type definition - ${type.name}`}>
      <header>
        <table>
          <tbody>
            <tr className="text-2xl">
              <td className="text-gray-500 px-2 py-1 text-right">Type:</td>
              <td className="text-pink-500 font-mono">
                <code>{type.name}</code>
              </td>
            </tr>

            <tr>
              <td className="text-gray-500 px-2 py-1 text-right">Namespace:</td>
              <td className="font-mono">{pkg.pkgName}</td>
            </tr>

            <tr>
              <td className="text-gray-500 px-2 py-1 text-right">Extends:</td>
              <td className="font-mono">
                <DataType type={type.extends}></DataType>
              </td>
            </tr>
          </tbody>
        </table>

        {type.description}
      </header>

      {type.properties && (
        <section className="p-2 grid grid-cols-1 gap-4 max-w-6xl">
          <header>
            <h4 className="font-bold text-lg">Properties</h4>
          </header>

          {type.properties.map((prop) => (
            <section key={prop.name} className="border rounded shadow m-2">
              <header className="bg-gray-200 px-4 py-2">
                <div className="flex flex-row items-center flex-wrap">
                  <h5 className="font-bold">{prop.name}</h5>
                  <code className="mr-4">
                    : <DataType {...prop}></DataType>
                  </code>
                  <p>{prop.description || <em>--</em>}</p>
                </div>
              </header>

              {prop.examples && (
                <div className="p-4">
                  <header>
                    <h6 className="font-bold">Examples</h6>
                  </header>
                  {prop.examples.map((example, index) =>
                    example.code ? (
                      <div key={index}>
                        <CodeFile {...example}></CodeFile>
                      </div>
                    ) : example.ref ? (
                      <span key={index}>
                        see{" "}
                        <Link
                          href={{
                            pathname: "/references/types/[...ns]",
                            query: { ns: example.ref.join("/") },
                          }}
                          as={`/references/types/${example.ref.join("/")}`}
                        >
                          <a>
                            <code>{example.ref[1]}</code>
                          </a>
                        </Link>{" "}
                        from package: <code>{example.ref[0]}</code>
                      </span>
                    ) : (
                      <code key={index}>
                        <pre>{JSON.stringify(example, null, 2)}</pre>
                      </code>
                    ),
                  )}
                </div>
              )}
            </section>
          ))}
        </section>
      )}
    </HomeLayout>
  );
}
