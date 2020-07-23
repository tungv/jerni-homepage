import React, { Fragment } from "react";

import CodeFile from "./CodeFile";
import DataType from "./DataType";
import HomeLayout from "./HomeLayout";
import Link from "next/link";
import linkToType from "../linkToTypes";
import getTypeProperties from "../getTypeProperties";

export default function TypeDetail(props) {
  const { pkg, type } = props;

  const inherits = Array.isArray(type.extends)
    ? getTypeProperties(...type.extends)
        .map((t) => ({ ...t, from: type.extends }))
        .filter((t) =>
          type.properties.some((ownProp) => ownProp.name !== t.name),
        )
    : [];

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
                {Array.isArray(type.extends) ? (
                  <Link {...linkToType(...type.extends)}>
                    <a>{type.extends.join("::")}</a>
                  </Link>
                ) : (
                  <DataType type={type.extends}></DataType>
                )}
              </td>
            </tr>

            {type.description && (
              <tr>
                <td className="text-gray-500 px-2 py-1 text-right">
                  Description:
                </td>
                <td className="font-serif">{type.description}</td>
              </tr>
            )}
          </tbody>
        </table>
      </header>

      {(type.properties || inherits.length > 0) && (
        <section className="p-2 grid grid-cols-1 gap-4 max-w-6xl">
          <header>
            <h4 className="font-bold text-lg">Properties</h4>
          </header>
          {inherits.map((prop) => (
            <section key={prop.name} className="border rounded shadow m-2">
              <div className="px-4 text-sm bg-teal-500 text-white">
                inherited from{" "}
                <Link {...linkToType(...type.extends)}>
                  <a className="font-mono text-white">
                    {type.extends.join("::")}
                  </a>
                </Link>
              </div>
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
                <div className="p-4 grid grid-cols-1 gap-4">
                  <header>
                    <h6 className="font-bold">Examples</h6>
                  </header>
                  <Examples examples={prop.examples} />
                </div>
              )}
            </section>
          ))}

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
    </HomeLayout>
  );
}

function Examples(props) {
  return props.examples.map((example, index) =>
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
  );
}
