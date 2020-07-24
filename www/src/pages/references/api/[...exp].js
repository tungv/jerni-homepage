import React from "react";

import APIDetail from "../../../components/APIDetail";
import ContextCurrentPackage from "../../../ContextCurrentPackage";
import pkgs from "../../../data/pkgs";

export default function ExportDetailPage(props) {
  const { pkgName, expPath } = props;

  const pkg = pkgs.find((pkg) => pkg.pkgName === pkgName);
  const exp = pkg.exports.find((exp) => exp.path === expPath);

  return (
    <ContextCurrentPackage.Provider value={pkg}>
      <APIDetail pkg={pkg} exp={exp}></APIDetail>
    </ContextCurrentPackage.Provider>
  );
}

export async function getStaticProps(context) {
  const {
    params: { exp: fullPath },
  } = context;

  const pkg = pkgs.find((pkg) =>
    pkg.exports.some((exp) => pkg.pkgName + exp.path === fullPath.join("/")),
  );
  const exp = pkg.exports.find(
    (exp) => pkg.pkgName + exp.path === fullPath.join("/"),
  );

  return {
    props: {
      pkgName: pkg.pkgName,
      expPath: exp.path,
    }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  const paths = pkgs.flatMap((pkg) =>
    pkg.exports.map((exp) =>
      [...pkg.pkgName.split("/"), ...exp.path.split("/")].filter((x) => x),
    ),
  );

  return {
    paths: paths.map((exp) => ({ params: { exp } })),
    fallback: false,
  };
}
