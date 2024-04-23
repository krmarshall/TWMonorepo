import { Fragment, useContext, useEffect, useState } from 'react';
import { ElectronContext } from '../contexts/ElectronContext';
import { CharacterListInterface } from '../@types/CharacterListInterfaceRef';
import AgentCell from '../components/AgentCell';

const AgentSelect = () => {
  const { state } = useContext(ElectronContext);
  const [charList, setCharList] = useState<CharacterListInterface | undefined>();
  useEffect(() => {
    window.API.getCharList(state.workspacePath)
      .then((list) => setCharList(list))
      .catch(() => setCharList(undefined));
  }, []);
  return (
    <div className="p-2 overflow-y-scroll">
      <img src="F:\Downloads\workspace\test\output_img\mod\battle_ui\ability_icons\hef_torinubar_kinetic_combat.webp" />
      {charList !== undefined &&
        Object.entries(charList).map((entry) => {
          const factionKey = entry[0];
          const factionData = entry[1];
          if (Object.keys(factionData.lords).length === 0 && Object.keys(factionData.heroes).length === 0) {
            return <Fragment key={factionKey}></Fragment>;
          } else {
            return (
              <div key={factionKey}>
                <h1>{factionKey}</h1>
                <div>
                  {Object.entries(factionData.lords).map((lord) => {
                    const lordKey = lord[0];
                    const lordData = lord[1];
                    return (
                      <AgentCell key={lordKey} agentKey={lordKey} agentName={lordData.name} factionKey={factionKey} />
                    );
                  })}
                  {Object.entries(factionData.heroes).map((hero) => {
                    const heroKey = hero[0];
                    const heroData = hero[1];
                    return (
                      <AgentCell key={heroKey} agentKey={heroKey} agentName={heroData.name} factionKey={factionKey} />
                    );
                  })}
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export default AgentSelect;
