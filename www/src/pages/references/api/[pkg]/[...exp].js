import React from "react";

import APIDetail from "../../../../components/APIDetail";

export default function ExportDetailPage(props) {
  const { pkgName, expPath } = props;

  return <APIDetail pkgName={pkgName} expPath={expPath}></APIDetail>;
}

export async function getServerSideProps(context) {
  console.log({ context });
  const {
    query: { pkg, exp },
  } = context;
  return {
    props: {
      pkgName: pkg,
      expPath: "/" + exp.join("/"),
    }, // will be passed to the page component as props
  };
}
