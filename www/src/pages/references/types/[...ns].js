import React from "react";

import ContextCurrentPackage from "../../../ContextCurrentPackage";
import TypeDetail from "../../../components/TypeDetail";
import pkgs from "../../../data/pkgs";

export default function ExportDetailPage(props) {
  const { pkgName, typeName } = props;

  const pkg = pkgs.find((pkg) => pkg.pkgName === pkgName);
  const type = pkg.types.find((type) => type.name === typeName);

  return (
    <ContextCurrentPackage.Provider value={pkg}>
      <TypeDetail type={type} pkg={pkg} />
    </ContextCurrentPackage.Provider>
  );
}

export async function getStaticProps(context) {
  const {
    params: { ns: fullPath },
  } = context;

  const pkg = pkgs.find((pkg) =>
    pkg.types.some(
      (type) => [pkg.pkgName, type.name].join("/") === fullPath.join("/"),
    ),
  );
  const type = pkg.types.find(
    (type) => [pkg.pkgName, type.name].join("/") === fullPath.join("/"),
  );

  return {
    props: {
      pkgName: pkg.pkgName,
      typeName: type.name,
    }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  const paths = pkgs.flatMap((pkg) =>
    pkg.types.map((type) =>
      [...pkg.pkgName.split("/"), ...type.name.split("/")].filter((x) => x),
    ),
  );

  return {
    paths: paths.map((ns) => ({ params: { ns } })),
    fallback: false,
  };
}
