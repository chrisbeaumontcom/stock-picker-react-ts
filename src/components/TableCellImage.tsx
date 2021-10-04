import React from 'react';

type Props = {
  colour: string;
  img: string;
  pricetext: string;
};

export default function ImageCell({ colour, img, pricetext }: Props) {
  return (
    <td className="thumb-col">
      <div>{colour}</div>
      <img src={img} alt="thumbnail image" />
      <div>{pricetext}</div>
    </td>
  );
}
