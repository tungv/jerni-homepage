export default function linkToType(pkgName, typeName) {
  return {
    href: {
      pathname: "/references/types/[...ns]",
      query: { ns: [pkgName.replace("@", "~"), typeName].join("/") },
    },
    as: `/references/types/${[pkgName.replace("@", "~"), typeName].join("/")}`,
  };
}
