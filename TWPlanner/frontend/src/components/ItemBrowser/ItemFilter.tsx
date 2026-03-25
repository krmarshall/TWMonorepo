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
import factionImages from '../../imgs/factions/factionImages.ts';

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

  const [availableCultures, setAvailableCultures] = useState<Array<string>>([]);
  const [selectedCulture, setSelectedCulture] = useState<string>('Any');

  // When mod changes generate all the cultures we can filter for in that data set
  useEffect(() => {
    const cultures: Array<string> = [];
    itemData?.forEach((item) => {
      if (item.available?.cultures === undefined && item.available?.subcultures === undefined) {
        return;
      }
      Object.values(item.available?.cultures).forEach((culture) => {
        if (!cultures.includes(culture.name)) cultures.push(culture.name);
      });
      Object.values(item.available?.subcultures).forEach((subculture) => {
        if (!cultures.includes(subculture.name)) cultures.push(subculture.name);
      });
    });
    cultures.sort();
    setAvailableCultures(cultures);
  }, [itemData]);

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
      searchValues.length === 0 &&
      selectedCulture === 'Any'
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
      // Culture / Subculture
      const combCultures: Array<string> = [];
      Object.values(item.available?.cultures ?? {}).forEach((culture) => combCultures.push(culture.name));
      Object.values(item.available?.subcultures ?? {}).forEach((subculture) => combCultures.push(subculture.name));
      if (selectedCulture !== 'Any' && !combCultures.includes(selectedCulture)) {
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
    selectedCulture,
  ]);

  const clearFilters = () => {
    setQuestItems(undefined);
    setItemSets(undefined);
    setSelectedRarities(itemRarityValues);
    setSelectedCategories(itemCategoryValues);
    setSelectedSubcategories(itemSubcategoryValues);
    setSearchValues([]);
    setSelectedCulture('Any');
  };

  return (
    <div className="grow max-h-68 flex flex-col bg-gray-700 border rounded-md border-gray-500 justify-self-center p-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
      <div className="flex flex-row place-content-center mb-1">
        <hr className="grow mt-5 opacity-50 border-gray-200" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Filters</h1>
        <hr className="grow mt-5 opacity-50 border-gray-200" />
        <button
          className="mx-2 button hover-scale bg-gray-500 text-xl text-gray-50 cursor-pointer"
          onClick={clearFilters}
        >
          Reset
        </button>
        <p className="text-gray-50 text-right text-2xl my-auto w-23">
          {filteredItemData?.length}/{itemData?.length}
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <TextSearch searchValues={searchValues} setSearchValues={setSearchValues} />
        <div className="flex flex-row flex-wrap gap-4 mx-1 text-lg text-gray-50">
          <div className="flex flex-col flex-nowrap gap-2">
            <TripleToggle name="Quest Items: " value={questItems} setValue={setQuestItems} />

            <TripleToggle name="Item Sets: " value={itemSets} setValue={setItemSets} />

            <div className="text-lg">
              <label htmlFor="cultureSelect" className="text-xl">
                Culture:{' '}
              </label>
              <select
                id="cultureSelect"
                value={selectedCulture}
                className="bg-gray-500 rounded p-1 w-36"
                onChange={(event) => setSelectedCulture(event.target.value)}
              >
                <option value="Any">Any</option>
                {availableCultures.map((culture) => {
                  return (
                    <option key={culture} value={culture}>
                      {culture}
                    </option>
                  );
                })}
              </select>
            </div>
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
      </div>
    </div>
  );
};

export default ItemFilter;
