import { useContext } from 'react';
import { AppContext, AppContextActions } from '../../../TWPlanner/frontend/src/contexts/AppContext';
import { createEmptyCharacterBuild } from '../../../TWPlanner/frontend/src/utils/sharedFunctions';
import { ElectronContext } from '../contexts/ElectronContext';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  const getSkillTree = (factionKey: string, agentKey: string) => {
    window.API.getSkillTree(state.workspacePath, factionKey, agentKey)
      .then((skillTree) => {
        plannerContext.dispatch({ type: AppContextActions.changeCharacterData, payload: { characterData: skillTree } });
        plannerContext.dispatch({
          type: AppContextActions.changeCharacterBuild,
          payload: { characterBuild: createEmptyCharacterBuild(skillTree, 'mod', factionKey, agentKey) },
        });
        navigate(`/skillTree/mod/${factionKey}/${agentKey}`);
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

export default AgentCell;
