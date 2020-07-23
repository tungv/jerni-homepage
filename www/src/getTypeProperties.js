import pkgs from "./data/pkgs";

export default function getTypeProperties(pkgName, typeName) {
  const pkg = pkgs.find((pkg) => pkg.pkgName === pkgName);

  const type = pkg.types.find((type) => type.name === typeName);

  return type.properties;
}
