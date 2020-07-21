import pkgs from "../data/pkgs";
import HomeLayout from "./HomeLayout";
import CodeFile from "./CodeFile";

export default function APIDetail(props) {
  const { pkg, exp } = props;

  return (
    <HomeLayout
      title={`jerni - API References - Module: ${pkg.pkgName}${exp.path}`}
    >
      <header>
        <h2>
          <code>
            {pkg.pkgName}
            <b>{exp.path}</b>
          </code>
        </h2>
        {exp.description}
      </header>

      <section>
        <h3>Usage</h3>
        <div>
          <CodeFile language="js">
            {`// ${exp.description}
const ${exp.referredName} = require("${pkg.pkgName}${exp.path}");

${exp.examples ?? "// no examples"}`}
          </CodeFile>
        </div>
      </section>

      <div>
        <pre>{JSON.stringify({ pkg, exp }, null, 2)}</pre>
      </div>
    </HomeLayout>
  );
}
