// This component is a table that displays a list of selected
// SKUs for this style page only as well as discount and totals
import React, { useEffect } from 'react';
import { formatPrice } from '../utils';
import { LineItem } from '../appTypes';

type Props = {
  style: string;
  imgPath: string;
  order: LineItem[];
  country: string;
  discountPercentage: number;
  removeLineItem: Function;
  addToOrder: Function;
};

export default function OrderInfo({
  style,
  imgPath,
  order,
  country,
  discountPercentage,
  removeLineItem,
  addToOrder,
}: Props) {
  // Only display items in the current style
  const lineitems = order.filter((el: LineItem) => {
    return el.style === style;
  });
  // Count whole order
  const count = order.reduce((total, acc) => {
    return total + acc.ordqty;
  }, 0);

  useEffect(() => {
    updateBag(count);
  }, [count]);

  // Get sub total for this style only
  const subtotal =
    order.reduce((amount, acc) => {
      if (acc.style === style) {
        return amount + acc.customerPrice * acc.ordqty * 100;
      }
      return amount;
    }, 0) / 100;
  // Calculate discount
  const discount = (subtotal * discountPercentage) / 100;
  // Total for this style selection
  const total = subtotal - discount;
  // Update the cart in the page header
  function updateBag(count: number): void {
    var display = document.getElementById('bagdisplay');
    if (display) {
      if (count > 0) {
        display.innerHTML = `<a href="/checkout">My Cart [${count}] ${
          count === 1 ? 'item' : 'items'
        }</a>`;
      } else {
        display.innerHTML = 'My Cart is empty';
      }
    }
  }
  return (
    <>
      {lineitems.length > 0 && (
        <div>
          <h3 className="summary">Summary</h3>
          <table className="page-order">
            <tbody>
              {lineitems.map((item) => (
                <tr key={'list' + item.itemid}>
                  <td className="thumb-col">
                    <img src={imgPath + item.img} alt="thumbnail image" />
                  </td>
                  <td>{item.style}</td>
                  <td>{item.colour}</td>
                  <td>{item.styletext}</td>
                  <td>{item.size}</td>
                  <td>{formatPrice(item.customerPrice)}</td>
                  <td>
                    <input
                      name={'ord' + item.itemid}
                      value={item.ordqty}
                      onChange={(event) =>
                        addToOrder(event.target, item, item.img)
                      }
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        removeLineItem(item.itemid);
                      }}
                      className="btn del-item"
                    >
                      &times;
                    </button>
                  </td>
                  <td className="money">
                    {formatPrice(item.customerPrice * item.ordqty)}
                  </td>
                </tr>
              ))}
              {/* Summary Totals*/}
              {total > 0 && (
                <>
                  <tr>
                    <td colSpan={8} className="right">
                      Sub Total
                    </td>
                    <td className="money">{formatPrice(subtotal)}</td>
                  </tr>
                  {discount > 0 && (
                    <tr>
                      <td colSpan={8} className="right">
                        Discount ({discountPercentage}%)
                      </td>
                      <td className="money">{formatPrice(discount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={8} className="right">
                      Total
                    </td>
                    <td className="money">{country + formatPrice(total)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
