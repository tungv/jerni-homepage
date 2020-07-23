import React from "react";

import HomeLayout from "../components/HomeLayout";
import Link from "next/link";
import pkgs from "../data/pkgs";
import CodeFile from "../components/CodeFile";
import IconBook10 from "../icons/Book10";
import linkToType from "../linkToTypes";

export default function ReferencesPage() {
  return (
    <HomeLayout title="jerni - API References">
      <section className="w-full max-w-4xl m-auto p-2">
        <h2 className="text-3xl">API References</h2>
      </section>

      <section className="w-full max-w-4xl m-auto p-2 grid grid-cols-1 gap-4">
        {pkgs.map((pkg) => (
          <Package {...pkg} key={pkg.pkgName} />
        ))}
      </section>
    </HomeLayout>
  );
}

function Package(props) {
  const { pkgName, exports, types } = props;

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <header className="py-2 px-4 bg-teal-500 text-white">
        <h3 className="text-2xl font-mono">{pkgName}</h3>
      </header>

      <nav className="grid grid-cols-1 gap-4 p-2">
        <div>
          <h4 className="text-lg m-2">Exports</h4>
          <ul>
            {exports.map((exp) => (
              <li key={exp.path} className="my-2">
                <h5 className="p-2">{exp.description}</h5>
                <div className="flex flex-row relative rounded-lg overflow-hidden shadow-md mx-2">
                  <div className="flex-1">
                    <CodeFile language="js">
                      {`// ${exp.description}
const ${exp.referredName} = require("${pkgName}${exp.path}");`}
                    </CodeFile>
                  </div>
                  <Link
                    href={{
                      pathname: "/references/api/[...exp]",
                      query: {
                        exp: [pkgName.replace("@", "~"), exp.path].join(""),
                      },
                    }}
                    as={`/references/api/${[
                      pkgName.replace("@", "~"),
                      exp.path,
                    ].join("")}`}
                  >
                    <a className="no-underline bg-teal-500 text-white absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center">
                      <IconBook10 />
                    </a>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg m-2">Types</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {types.map((type) => (
              <li key={type.name} className="">
                <Link {...linkToType(pkgName, type.name)}>
                  <a>
                    <h5 className="p-2">{type.name}</h5>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
