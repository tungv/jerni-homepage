import React from "react";

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
        <section className="p-2">
          <header>
            <h4 className="font-bold text-lg">Properties</h4>
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
                  <th className="bg-gray-700 text-white border p-1">
                    Examples
                  </th>
                </tr>
              </thead>
              <tbody>
                {type.properties.map((prop) => (
                  <tr key={prop.name}>
                    <td className="border px-4 py-2">{prop.name}</td>
                    <td className="border px-4 py-2 font-mono">
                      <DataType {...prop}></DataType>
                    </td>
                    <td className="border px-4 py-2 font-serif">
                      {prop.description || <em>--</em>}
                    </td>
                    <td className="border px-4 py-2 font-serif">
                      {!prop.examples && <em>--</em>}
                      {prop.examples &&
                        prop.examples.map((example, index) =>
                          example.ref ? (
                            <span key={index}>
                              see{" "}
                              <Link
                                href={{
                                  pathname: "/references/types/[...ns]",
                                  query: { ns: example.ref.join("/") },
                                }}
                                as={`/references/types/${example.ref.join(
                                  "/",
                                )}`}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </HomeLayout>
  );
}
