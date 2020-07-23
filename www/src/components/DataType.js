import React, { Fragment, useContext } from "react";
import Link from "next/link";
import ContextCurrentPackage from "../ContextCurrentPackage";
import linkToType from "../linkToTypes";

const PRIMITIVES = [
  "string",
  "number",
  "Function",
  "Object",
  "void",
  "Error",
  "Symbol",
];

export default function DataType(props) {
  const pkg = useContext(ContextCurrentPackage);

  if (!props.type) {
    return <span>unknown</span>;
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
        {props.fn.asyncGenerator && (
          <span>
            <span className="italic text-pink-500">AsyncIterable</span>&lt;
          </span>
        )}
        {props.fn.async && (
          <span>
            <span className="italic text-pink-500">Promise</span>&lt;
          </span>
        )}
        <DataType {...props.fn.returns} />
        {(props.fn.async || props.fn.asyncGenerator) && <span>&gt;</span>}
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

  if (Array.isArray(props.type) && props.type.length === 2) {
    return (
      <Link {...linkToType(...props.type)}>
        <a>{props.type[1]}</a>
      </Link>
    );
  }

  if (PRIMITIVES.includes(props.type)) {
    return <span className="text-pink-500 italic">{props.type}</span>;
  }

  if (typeof props.type !== "string") {
    console.log(props.type);
  }

  return (
    <Link {...linkToType(pkg.pkgName, props.type)}>
      <a>{props.type}</a>
    </Link>
  );
}
