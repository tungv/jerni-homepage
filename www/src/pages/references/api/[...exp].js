import React from "react";

import APIDetail from "../../../components/APIDetail";
import pkgs from "../../../data/pkgs";

export default function ExportDetailPage(props) {
  const { pkgName, expPath } = props;

  const pkg = pkgs.find((pkg) => pkg.pkgName === pkgName);
  const exp = pkg.exports.find((exp) => exp.path === expPath);

  return <APIDetail pkg={pkg} exp={exp}></APIDetail>;
}

export async function getServerSideProps(context) {
  const {
    query: { exp: fullPath },
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