import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { ElectronContext } from '../contexts/ElectronContext';
import { CharacterListInterface } from '../@types/charListInterface';
import { AppContext, AppContextActions } from '../../TotalWarhammerPlanner/frontend/src/contexts/AppContext';
import { createEmptyCharacterBuild } from '../../TotalWarhammerPlanner/frontend/src/utils/sharedFunctions';

export const Route = createFileRoute('/treeSelect')({
  component: TreeSelect,
});

function TreeSelect() {
  const { state } = useContext(ElectronContext);
  const [charList, setCharList] = useState<CharacterListInterface | undefined>();
  useEffect(() => {
    window.API.getCharList(state.workspacePath)
      .then((list) => setCharList(list))
      .catch(() => setCharList(undefined));
  }, []);

  return (
    <div className="p-2">
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
}

const AgentCell = ({
  agentKey,
  agentName,
  factionKey,
}: {
  agentKey: string;
  agentName: string;
  factionKey: string;
}) => {
  const { state } = useContext(ElectronContext);
  const plannerContext = useContext(AppContext);

  const navigate = useNavigate({ from: '/treeSelect' });

  const getSkillTree = (factionKey: string, agentKey: string) => {
    window.API.getSkillTree(state.workspacePath, factionKey, agentKey)
      .then((skillTree) => {
        plannerContext.dispatch({ type: AppContextActions.changeCharacterData, payload: { characterData: skillTree } });
        plannerContext.dispatch({
          type: AppContextActions.changeCharacterBuild,
          payload: { characterBuild: createEmptyCharacterBuild(skillTree, 'mod', factionKey, agentKey) },
        });
        navigate({ to: '/skillTree' });
      })
      .catch((error) => console.log(error));
  };

  return (
    <button className="border rounded p-2" onClick={() => getSkillTree(factionKey, agentKey)}>
      <h2>{agentName}</h2>
      <h3>{agentKey}</h3>
    </button>
  );
};
