import React from 'react';

type Props = {
  col1txt: string;
  col2txt: string;
  sizelist: Array<string>;
};

export default function TableLegend({ col1txt, col2txt, sizelist }: Props) {
  return (
    <tr>
      <th>{col1txt}</th>
      <th>{col2txt}</th>
      {sizelist.map((size) => (
        <th key={'o' + size}>{size}</th>
      ))}
    </tr>
  );
}
