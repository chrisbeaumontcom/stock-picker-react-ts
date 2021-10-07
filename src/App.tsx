// App inserts API product data into a reactive table
// for stock picking by SKU: Style/Colour/Size combination
// Designed to be added to a wholesale apparel catalogue for
// resellers to create purchase orders. Checkout summary is
// not implimented in this demo.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableLegend from './components/TableLegend';
import TableCellImage from './components/TableCellImage';
import TableCellSelect from './components/TableCellSelect';
import TableCellOrder from './components/TableCellOrder';
import OrderInfo from './components/OrderInfo';
import { Product, Colour, Size, LineItem, Config } from './appTypes';
import { formatPrice, formatImage, sortOrder } from './utils';
import './App.css';

const config: Config = {
  urlProduct: import.meta.env.VITE_PRODUCT_URL + '',
  imagePath: import.meta.env.VITE_IMAGES_URL + '',
  sessionKey: 'Example-order',
};

export default function App() {
  const [msg, setMsg] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [colours, setColours] = useState<Colour[]>([]);
  const [product, setProduct] = useState<Product>({} as Product);
  const [order, setOrder] = useState<LineItem[]>([]);

  useEffect(() => {
    // Read the style id from the loaded page
    const docstyle = document.getElementById('root');
    const id =
      docstyle && docstyle.dataset && docstyle.dataset.id
        ? docstyle.dataset.id
        : '0';
    // Get the order from storage
    setOrder(fetchOrderData());
    // Get data for this style from the api
    fetchProductData(config.urlProduct + id);
  }, []);

  useEffect(() => {
    // On load populate input fields with order data from storage
    // Re-runs after colours is populated only after the first mount
    order.forEach((item) => {
      updateQty(item.itemid, item.ordqty);
    });
  }, [colours]);

  function fetchOrderData(): LineItem[] {
    const str =
      sessionStorage && sessionStorage[config.sessionKey]
        ? (sessionStorage.getItem(config.sessionKey) as string)
        : '[]';
    return JSON.parse(str);
  }
  function saveOrderData(items: LineItem[]) {
    if (sessionStorage) {
      sessionStorage.setItem(config.sessionKey, JSON.stringify(items));
    } else {
      setMsg('Sorry, storing your order failed.');
    }
  }
  async function fetchProductData(endpoint: string): Promise<void> {
    try {
      const response = await axios.get(endpoint);
      if (response && response.data && response.data.success === true) {
        const data = response.data;
        if (data && data.success === true) {
          setColours(processColours(data.allocation));
          const newProduct: Product = {
            style: data.style,
            styletext: data.styletext,
            sizelist: data.sizelist.split(' '),
            country: data.country,
            discountPercentage: data.discountPercentage,
          };
          setProduct(newProduct);
          setMsg(`Loaded: ${newProduct.style} ${newProduct.styletext}`);
          setLoaded(true);
        } else {
          throw new Error('Incorrect fetch data problem');
        }
      } else {
        throw new Error('Incorrect fetch response');
      }
    } catch (err) {
      setMsg('Failed to load product...');
      setLoaded(true);
      console.log('Get Product Error:', (err as Error).message);
    }
  }
  function processColours(allocation: Colour[]) {
    // Add some useful fields to the allocation data library
    if (allocation && allocation.length > 0) {
      allocation.forEach(function (colour: Colour) {
        colour.sizes.forEach(function (size: Size) {
          size.ordqty = 0;
        });
      });
    }
    return allocation;
  }
  function updateQty(vitemid: string, qty: number): void {
    if (colours && colours.length > 0) {
      for (var j = 0; j < colours.length; j++) {
        var sizes = colours[j].sizes;
        for (var i = 0; i < sizes.length; i++) {
          if (sizes[i].itemid === vitemid) {
            sizes[i].ordqty = qty;
          }
        }
      }
    }
  }
  function addLineItem(lineitem: LineItem) {
    const filterOrder = order.filter((item: LineItem) => {
      return lineitem.itemid !== item.itemid;
    });
    const newOrder = [...filterOrder, lineitem];
    sortOrder(newOrder, product.sizelist);
    setOrder(newOrder);
    saveOrderData(newOrder);
  }
  function removeLineItem(id: string): void {
    updateQty(id, 0);
    const filterOrder = order.filter((item) => {
      return item.itemid !== id;
    });
    setOrder(filterOrder);
    saveOrderData(filterOrder);
  }
  function colourItems(style: string, colour: string): LineItem[] {
    return order.filter((el: LineItem) => {
      return el.colour === colour && el.style === style;
    });
  }
  const addToOrder = (
    input: HTMLInputElement,
    item: Size,
    img: string
  ): void => {
    const valTest = /^-?[0-9]+$/;
    const inputVal = input.value;
    if (inputVal === '' || inputVal === '0') {
      updateQty(item.itemid, 0);
      removeLineItem(item.itemid);
      return;
    }
    if (inputVal != '' && !valTest.test(inputVal)) {
      alert('Warning: not a number.');
      return;
    }
    if (inputVal != '' && parseInt(inputVal) > item.qty) {
      alert('Warning: too high.');
      return;
    }
    updateQty(item.itemid, parseInt(inputVal));
    const lineitem = {
      ...item,
      ordqty: parseInt(inputVal),
      img,
      styletext: product.styletext,
    };
    addLineItem(lineitem);
  };

  return (
    <div className="App">
      <div className="container">
        <h2>Stock Picker for Style: {product.style}</h2>
        <p>{import.meta.env.MODE}</p>
        <p>{loaded ? msg : 'loading...'}</p>
        {loaded && product && (
          <table className="allocation">
            <thead>
              {product.sizelist && (
                <TableLegend
                  col1txt={product.style}
                  col2txt="Order"
                  sizelist={product.sizelist}
                />
              )}
            </thead>
            <tbody>
              {colours &&
                colours.map((colour) => (
                  <tr key={'colour' + colour.colour}>
                    <TableCellImage
                      colour={colour.colour}
                      img={formatImage(colour.thumb, config.imagePath)}
                      pricetext={product.country + formatPrice(colour.price)}
                    />
                    <TableCellOrder
                      removeLineItem={removeLineItem}
                      lineitems={colourItems(product.style, colour.colour)}
                    />
                    {colour.sizes.map((size) => (
                      <TableCellSelect
                        size={size}
                        addToOrder={addToOrder}
                        key={size.itemid}
                        img={colour.thumb}
                      />
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        <OrderInfo
          style={product.style}
          imgPath={config.imagePath}
          order={order}
          country={product.country}
          discountPercentage={product.discountPercentage}
          removeLineItem={removeLineItem}
          addToOrder={addToOrder}
        />
      </div>
    </div>
  );
}
