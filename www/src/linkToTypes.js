export default function linkToType(pkgName, typeName) {
  return {
    href: {
      pathname: "/references/types/[...ns]",
      query: { ns: [pkgName, typeName].join("/") },
    },
    as: `/references/types/${[pkgName, typeName].join("/")}`,
  };
}
