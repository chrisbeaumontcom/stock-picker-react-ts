import React from 'react';
import { LineItem } from '../appTypes';
type Props = {
  lineitems: LineItem[];
  removeLineItem: Function;
};

export default function OrderCell({ lineitems, removeLineItem }: Props) {
  return (
    <td className="order-list">
      {lineitems.map((item) => (
        <div key={'k' + item.itemid} className="no-wrap">
          Size {item.size}: {item.ordqty}
          <button
            onClick={() => {
              removeLineItem(item.itemid);
            }}
            className="btn del-item"
          >
            &times;
          </button>
        </div>
      ))}
    </td>
  );
}
