import { ExtendedItemInterface } from '../../@types/ItemInterfaceRef.ts';

interface PropsInterface {
  item: ExtendedItemInterface;
}

const ItemCell = ({ item }: PropsInterface) => {
  return (
    <li key={item.key} className="w-fit h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 bg-gray-600">
      <h4>{item.onscreen_name}</h4>
    </li>
  );
};

export default ItemCell;
