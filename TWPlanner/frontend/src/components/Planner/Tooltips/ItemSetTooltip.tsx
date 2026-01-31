import TooltipWrapper from '../../TooltipWrapper.tsx';
import { ItemSetInterface } from '../../../@types/CharacterInterfaceRef.ts';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext.tsx';
import useBulkMediaQueries from '../../../hooks/useBulkMediaQueries.tsx';
import DOMPurify from 'dompurify';
import {
  getRelatedAbilities,
  getRelatedAttributes,
  getRelatedContactPhases,
  replaceKeepCaps,
} from '../../../utils/sharedFunctions.ts';
import SkillEffect from './SubToolTips/SkillEffect.tsx';
import TooltipAbilityCycler from './TooltipAbiltyCycler.tsx';
import TooltipAbilityMap from './TooltipAbilityMap.tsx';
import ReactImage from '../../ReactImage.tsx';
import UnitCards from './SubToolTips/UnitCards.tsx';

import itemSetIcon from '../../../imgs/other/icon_item_set.webp';

interface PropInterface {
  itemSet: ItemSetInterface;
  index: number;
  ctrCounter: number;
  setCtrCounter: React.Dispatch<React.SetStateAction<number>>;
  setTooltipScrollable?: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipRef?: React.RefObject<HTMLSpanElement>;
}

const ItemSetTooltip = ({
  itemSet,
  index,
  ctrCounter,
  setCtrCounter,
  setTooltipScrollable,
  tooltipRef,
}: PropInterface) => {
  const { state } = useContext(AppContext);
  const { searchString, selectedMod, highlightArray } = state;
  const { isMobile } = useBulkMediaQueries();

  useEffect(() => {
    const ctrKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        if (ctrCounter + 1 < relatedAbilities.length) {
          setCtrCounter(ctrCounter + 1);
        } else {
          setCtrCounter(0);
        }
      }
    };

    document.addEventListener('keydown', ctrKeyDownHandler);

    return () => {
      document.removeEventListener('keydown', ctrKeyDownHandler);
    };
  }, [ctrCounter]);

  useEffect(() => {
    if (setTooltipScrollable !== undefined) {
      if (tooltipRef?.current !== null && tooltipRef?.current !== undefined) {
        setTooltipScrollable(tooltipRef.current.scrollHeight > tooltipRef.current.clientHeight);
      } else {
        setTooltipScrollable(false);
      }
    }
  }, [ctrCounter]);

  const relatedAbilities = getRelatedAbilities(itemSet?.effects);
  const relatedPhases = getRelatedContactPhases(relatedAbilities[ctrCounter], itemSet?.effects);
  const relatedAttributes = getRelatedAttributes(relatedAbilities[ctrCounter], itemSet?.effects);

  let imgClassName = 'absolute w-6 h-6 bottom-1 right-0 z-10 hover-scale-large';
  if (highlightArray?.items?.[index].set) {
    imgClassName += ' rounded-full outline outline-offset-2 outline-yellow-400';
  }
  return (
    <TooltipWrapper
      noSkillRanks={true}
      tooltip={
        <>
          {!isMobile && (
            <span
              ref={tooltipRef}
              className="max-h-[98vh] text-center flex flex-row overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700"
            >
              <div className="flex flex-col">
                <div className="h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 bg-gray-600">
                  <h3
                    className="text-gray-50 text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(replaceKeepCaps(itemSet.name, searchString)),
                    }}
                  ></h3>
                  {itemSet.description.trim() && (
                    <h4
                      className="max-w-[20vw] mx-auto text-gray-50 opacity-70 text-lg"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(replaceKeepCaps(itemSet.description, searchString)),
                      }}
                    ></h4>
                  )}
                  <div className="flex flex-row flex-wrap max-w-[20vw] mb-2">
                    <h4 className="text-gray-50 text-xl">Set Contains:</h4>
                    {itemSet.contains?.map((subItem, index) => {
                      let subImgClassName = 'ml-2 w-12 h-12 -mr-1 -my-2 inline';
                      if (subItem.icon.match(/\/ability_icons\/|\/skills\/|campaign_ui\/ancillaries\//) !== null) {
                        subImgClassName += ' p-2.5';
                      }
                      return (
                        <div key={index} className="flex flex-row flex-nowrap w-full">
                          <ReactImage
                            srcList={[
                              `/imgs/vanilla3/${subItem.icon}.webp`,
                              `/imgs/${selectedMod}/${subItem.icon}.webp`,
                              `/imgs/vanilla3/${subItem.icon}.webp`,
                            ]}
                            className={subImgClassName}
                            alt=""
                            w="32"
                            h="32"
                          />
                          <span className="inline my-auto text-lg">{subItem.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <h4 className="text-gray-50 text-xl text-left mb-2">Provides the following effects once equipped:</h4>
                  {itemSet.effects?.map((effect, index) => {
                    return <SkillEffect key={index} skillEffect={effect} />;
                  })}
                  {itemSet.related_unit_cards !== undefined && (
                    <UnitCards relatedUnitCards={itemSet.related_unit_cards} />
                  )}
                </div>
                {relatedAbilities.length > 1 && (
                  <TooltipAbilityCycler
                    ctrCounter={ctrCounter}
                    setCtrCounter={setCtrCounter}
                    relatedAbilitiesLength={relatedAbilities.length}
                  />
                )}
              </div>
              {(relatedAbilities.length !== 0 || relatedPhases.length !== 0 || relatedAttributes.length !== 0) && (
                <TooltipAbilityMap
                  relatedAbilities={relatedAbilities}
                  relatedPhases={relatedPhases}
                  relatedAttributes={relatedAttributes}
                  ctrCounter={ctrCounter}
                />
              )}
            </span>
          )}
          {isMobile && (
            <span
              ref={tooltipRef}
              className="w-full max-h-full my-auto text-center flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700"
            >
              <div className="h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 bg-gray-600">
                <h3
                  className="text-gray-50 text-2xl"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(replaceKeepCaps(itemSet.name, searchString)),
                  }}
                ></h3>
                {itemSet.description.trim() && !isMobile && (
                  <h4
                    className="mx-auto text-gray-50 opacity-70 text-lg"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(replaceKeepCaps(itemSet.description, searchString)),
                    }}
                  ></h4>
                )}
                <div className="flex flex-row flex-wrap mb-2">
                  <h4 className="text-gray-50 text-xl">Set Contains:</h4>
                  {itemSet.contains?.map((subItem, index) => {
                    let subImgClassName = 'ml-2 w-12 h-12 -mr-1 -my-2 inline';
                    if (subItem.icon.match(/\/ability_icons\/|\/skills\/|campaign_ui\/ancillaries\//) !== null) {
                      subImgClassName += ' p-2.5';
                    }
                    return (
                      <div key={index} className="flex flex-row flex-nowrap w-full">
                        <ReactImage
                          srcList={[
                            `/imgs/vanilla3/${subItem.icon}.webp`,
                            `/imgs/${selectedMod}/${subItem.icon}.webp`,
                            `/imgs/vanilla3/${subItem.icon}.webp`,
                          ]}
                          className={subImgClassName}
                          alt=""
                          w="32"
                          h="32"
                        />
                        <span className="inline my-auto text-lg">{subItem.name}</span>
                      </div>
                    );
                  })}
                </div>
                <h4 className="text-gray-50 text-xl text-left mb-2">Provides the following effects once equipped:</h4>
                {itemSet.effects?.map((effect, index) => {
                  return <SkillEffect key={index} skillEffect={effect} />;
                })}
                {itemSet.related_unit_cards !== undefined && (
                  <UnitCards relatedUnitCards={itemSet.related_unit_cards} />
                )}
              </div>
              {relatedAbilities.length > 1 && (
                <TooltipAbilityCycler
                  ctrCounter={ctrCounter}
                  setCtrCounter={setCtrCounter}
                  relatedAbilitiesLength={relatedAbilities.length}
                />
              )}
              {(relatedAbilities.length !== 0 || relatedPhases.length !== 0 || relatedAttributes.length !== 0) && (
                <TooltipAbilityMap
                  relatedAbilities={relatedAbilities}
                  relatedPhases={relatedPhases}
                  relatedAttributes={relatedAttributes}
                  ctrCounter={ctrCounter}
                />
              )}
            </span>
          )}
        </>
      }
    >
      <img
        className={imgClassName}
        src={itemSetIcon}
        draggable={false}
        alt="questBattleIcon"
        width="32"
        height="32"
      ></img>
    </TooltipWrapper>
  );
};

export default ItemSetTooltip;
