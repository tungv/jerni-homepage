import pkgs from "../data/pkgs";

export default function APIDetail(props) {
  const { pkgName, expPath } = props;

  const pkg = pkgs.find((pkg) => pkg.pkgName === pkgName);
  const exp = pkg.exports.find((exp) => exp.path === expPath);

  return (
    <div>
      <pre>{JSON.stringify(exp, null, 2)}</pre>
    </div>
  );
}
