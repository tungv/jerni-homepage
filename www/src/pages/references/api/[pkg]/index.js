import pkgs from "../../../../data/pkgs";
import APIDetail from "../../../../components/APIDetail";

export default function ExportDetailPage(props) {
  const { pkgName } = props;

  return <APIDetail pkgName={pkgName} expPath=""></APIDetail>;
}

export async function getServerSideProps(context) {
  console.log({ context });
  const {
    query: { pkg },
  } = context;
  return {
    props: {
      pkgName: pkg,
    }, // will be passed to the page component as props
  };
}
