import React from "react";
import ReactMarkdown from "react-markdown";

export const LinkRenderer = ({...props}:any) => {
  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
}

type Props = {
  children: string | null | undefined,
};

export const Markdown = ({ children }: Props) => {
  return (
    <ReactMarkdown components={{ a: LinkRenderer }}>
      {children}
    </ReactMarkdown>
  );
};