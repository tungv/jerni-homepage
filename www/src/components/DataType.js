import React, { Fragment, useContext } from "react";
import Link from "next/link";
import ContextCurrentPackage from "../ContextCurrentPackage";

const PRIMITIVES = ["string", "number", "Function", "Object", "void"];

export default function DataType(props) {
  const pkg = useContext(ContextCurrentPackage);

  if (!props.type) {
    return <code>unknown</code>;
  }

  if (props.type.union) {
    return props.type.union.map((type, index, array) => (
      <Fragment key={index}>
        <DataType type={type} />
        {index !== array.length - 1 && "|"}
      </Fragment>
    ));
  }
  if (props.type === "Record") {
    return (
      <abbr>
        Record&lt;
        <i>{props.record.key.name}</i>:<DataType {...props.record.key} />,
        <i>{props.record.value.name}</i>:<DataType {...props.record.value} />
        &gt;
      </abbr>
    );
  }

  if (props.type === "function") {
    return (
      <abbr title={`function\n${props.description}`}>
        (
        {props.fn.params.map((p, index, { length }) => (
          <Fragment key={index}>
            {p.optional ? (
              <abbr title="optional">
                [<DataType {...p} />]
              </abbr>
            ) : (
              <DataType {...p} />
            )}
            {index !== length - 1 && ", "}
          </Fragment>
        ))}
        )&nbsp;=>&nbsp;
        {props.fn.async && <span>Promise&lt;</span>}
        <DataType {...props.fn.returns} />
        {props.fn.async && <span>&gt;</span>}
      </abbr>
    );
  }

  if (Array.isArray(props.type) && props.type.length === 1) {
    return (
      <Fragment>
        <DataType type={props.type[0]} />
        []
      </Fragment>
    );
  }

  if (PRIMITIVES.includes(props.type)) {
    return <code className="text-pink-500 italic">{props.type}</code>;
  }

  return (
    <Link
      href={{
        pathname: "/references/types/[...ns]",
        query: { ns: [pkg.pkgName, props.type].join("/") },
      }}
      as={`/references/types/${[pkg.pkgName, props.type].join("/")}`}
    >
      <a>{props.type}</a>
    </Link>
  );
}
