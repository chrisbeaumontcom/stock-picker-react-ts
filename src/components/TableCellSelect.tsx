import React from 'react';
import { showQty, showQtyTxt, isQty } from '../utils';
import { Size } from '../appTypes';

type Props = {
  size: Size;
  img: string;
  addToOrder: Function;
};

export default function SelectCell({ size, img, addToOrder }: Props) {
  return (
    <td key={size.itemid} title={'size: ' + size.size} className="stock-data">
      {isQty(size.qty) && (
        <input
          name={size.itemid}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            addToOrder(event.target, size, img)
          }
          value={size.ordqty > 0 ? size.ordqty.toString() : ''}
        />
      )}
      <div>{showQty(size.qty)}</div>
      <div className="no-wrap">{showQtyTxt(size.qty)}</div>
    </td>
  );
}
