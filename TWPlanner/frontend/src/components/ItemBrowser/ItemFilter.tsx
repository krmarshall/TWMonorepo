import { useContext, useDeferredValue, useEffect, useState } from 'react';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import {
  ExtendedItemInterface,
  ItemCategoryEnum,
  ItemRarityEnum,
  ItemSubcategoryEnum,
} from '../../@types/ItemInterfaceRef.ts';
import TripleToggle from './TripleToggle.tsx';
import MultiSelector from './MultiSelector.tsx';
import TextSearch from './TextSearch.tsx';
import { searchExtendedItemForKeyword } from '../../utils/searchFunctions.ts';

const ItemFilter = () => {
  const { state, dispatch } = useContext(AppContext);
  const { itemData, filteredItemData } = state;

  const [searchValues, setSearchValues] = useState<Array<string>>([]);
  const deferredSearchValues = useDeferredValue(searchValues);

  const [questItems, setQuestItems] = useState<boolean | undefined>(undefined);
  const [itemSets, setItemSets] = useState<boolean | undefined>(undefined);

  const itemRarityValues = Object.values(ItemRarityEnum);
  const [selectedRarities, setSelectedRarities] = useState<Array<string>>(itemRarityValues);
  const itemCategoryValues = Object.values(ItemCategoryEnum).filter(
    (category) => !['Mount', 'Form'].includes(category),
  );
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(itemCategoryValues);
  const itemSubcategoryValues = ['None', ...Object.values(ItemSubcategoryEnum)];
  const [selectedSubcategories, setSelectedSubcategories] = useState<Array<string>>(itemSubcategoryValues);

  // Set filtered data on initial load/mod change
  useEffect(() => {
    dispatch({ type: AppContextActions.changeFilteredItemData, payload: { filteredItemData: itemData } });
  }, [itemData]);

  // Set filtered data on a filter change
  useEffect(() => {
    let allRaritiesSelected = true;
    itemRarityValues.forEach((rarity) => {
      if (!selectedRarities.includes(rarity)) {
        allRaritiesSelected = false;
      }
    });
    let allCategoriesSelected = true;
    itemCategoryValues.forEach((category) => {
      if (!selectedCategories.includes(category)) {
        allCategoriesSelected = false;
      }
    });
    let allSubcategoriesSelected = true;
    itemSubcategoryValues.forEach((subcategory) => {
      if (!selectedSubcategories.includes(subcategory)) {
        allSubcategoriesSelected = false;
      }
    });
    // If filters are cleared return the entire data set
    if (
      questItems === undefined &&
      itemSets === undefined &&
      allRaritiesSelected &&
      allCategoriesSelected &&
      allSubcategoriesSelected &&
      searchValues.length === 0
    ) {
      return dispatch({ type: AppContextActions.changeFilteredItemData, payload: { filteredItemData: itemData } });
    }

    const newFilteredData: Array<ExtendedItemInterface> = [];
    itemData?.forEach((item) => {
      // Quest Items (unlocked_at_rank)
      if (questItems && item.unlocked_at_rank === undefined) {
        return;
      }
      if (questItems === false && item.unlocked_at_rank !== undefined) {
        return;
      }
      // Item Sets
      if (itemSets && item.item_set === undefined) {
        return;
      }
      if (itemSets === false && item.item_set !== undefined) {
        return;
      }
      // Rarity
      if (!selectedRarities.includes(item.rarity)) {
        return;
      }
      // Category
      if (!selectedCategories.includes(item.category)) {
        return;
      }
      // Subcategory
      if (
        (item.subcategory !== undefined && !selectedSubcategories.includes(item.subcategory as string)) ||
        (item.subcategory === undefined && !selectedSubcategories.includes('None'))
      ) {
        return;
      }
      // Search Terms
      let validSearch = true;
      deferredSearchValues.forEach((searchString) => {
        if (!searchExtendedItemForKeyword(item, searchString)) {
          validSearch = false;
        }
      });
      if (!validSearch) {
        return;
      }

      newFilteredData.push(item);
    });

    return dispatch({ type: AppContextActions.changeFilteredItemData, payload: { filteredItemData: newFilteredData } });
  }, [
    itemData,
    questItems,
    itemSets,
    selectedRarities,
    selectedCategories,
    selectedSubcategories,
    deferredSearchValues,
  ]);

  const clearFilters = () => {
    setQuestItems(undefined);
    setItemSets(undefined);
    setSelectedRarities(itemRarityValues);
    setSelectedCategories(itemCategoryValues);
    setSelectedSubcategories(itemSubcategoryValues);
    setSearchValues([]);
  };

  return (
    <div className="grow flex flex-col bg-gray-700 border rounded-md border-gray-500 justify-self-center p-1">
      <div className="flex flex-row place-content-center">
        <hr className="grow mt-5 opacity-50 border-gray-200" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Filters</h1>
        <hr className="grow mt-5 opacity-50 border-gray-200" />
      </div>
      <div className="flex flex-row flex-wrap gap-4 mx-1 text-lg text-gray-50">
        <TextSearch searchValues={searchValues} setSearchValues={setSearchValues} />

        <div className="flex flex-col flex-nowrap gap-2">
          <TripleToggle name="Quest Items: " value={questItems} setValue={setQuestItems} />

          <TripleToggle name="Item Sets: " value={itemSets} setValue={setItemSets} />
        </div>

        <MultiSelector
          name="Rarity: "
          optionsArray={itemRarityValues}
          selectedValues={selectedRarities}
          setSelectedValues={setSelectedRarities}
        />

        <MultiSelector
          name="Category: "
          optionsArray={itemCategoryValues}
          selectedValues={selectedCategories}
          setSelectedValues={setSelectedCategories}
        />

        <MultiSelector
          name="Subcategory: "
          optionsArray={itemSubcategoryValues}
          selectedValues={selectedSubcategories}
          setSelectedValues={setSelectedSubcategories}
        />
      </div>

      <p className="text-gray-50 text-center text-2xl">{filteredItemData?.length}</p>
      <button
        className="mx-auto button hover-scale bg-gray-500 text-xl text-gray-50 cursor-pointer"
        onClick={clearFilters}
      >
        Clear
      </button>
    </div>
  );
};

export default ItemFilter;
