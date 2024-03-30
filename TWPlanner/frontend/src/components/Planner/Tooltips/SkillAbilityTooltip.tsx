import { AbilityInterface } from '../../../@types/CharacterInterfaceRef';
import cooldownImg from '../../../imgs/other/icon_cooldown_26.webp';
import windsImg from '../../../imgs/other/winds_ui_replenish_battle_ph.webp';
import chargesImg from '../../../imgs/other/icon_uses.webp';
import SkillPhase from './SkillPhase';
import ReactImage from '../../ReactImage';
import SkillAbilityVortex from './SkillAbilityVortex';
import SkillAbilityProjectile from './SkillAbilityProjectile';
import SkillAbilityBombardment from './SkillAbilityBombardment';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import DOMPurify from 'dompurify';
import { replaceKeepCaps } from '../../../utils/sharedFunctions';

interface SkillAbilityTooltipPropInterface {
  ability: AbilityInterface;
}

const SkillAbilityTooltip = ({ ability }: SkillAbilityTooltipPropInterface) => {
  const { state } = useContext(AppContext);
  const { searchString } = state;
  const unitAbility = ability.unit_ability;

  let target = '';
  target += unitAbility.target_enemies ? 'Enemies ' : '';
  target += unitAbility.target_friends ? 'Allies ' : '';
  target += unitAbility.target_ground ? 'Ground ' : '';
  target += unitAbility.target_self ? 'Self ' : '';
  const doesTarget = target.length > 0 ? true : false;

  const abilitySrcList = [
    `/imgs/${unitAbility.icon_name}.webp`,
    `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`,
  ];

  const typeSrcList = [
    `/imgs/${unitAbility.type.icon_path}.webp`,
    `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`,
  ];
  return (
    <div className="flex-grow h-fit p-2 mb-2 rounded border border-gray-400 shadow-lg bg-gray-600 text-gray-50 text-lg">
      <div className="flex flex-row ml-2">
        <ReactImage
          srcList={abilitySrcList}
          className="w-8 h-8 m-0 mr-2 p-0"
          alt={unitAbility.onscreen_name}
          w="48"
          h="48"
        />
        <h3
          className="text-left whitespace-nowrap text-2xl pr-6 mr-auto"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(replaceKeepCaps(unitAbility.onscreen_name, searchString)),
          }}
        ></h3>
        {unitAbility.num_uses !== undefined && unitAbility.num_uses > 0 && (
          <div className="flex flex-row mr-3">
            <img className="w-6 h-6" src={chargesImg} alt="charges icon" width="24" height="24" />
            <p className="ml-1 text-center">{unitAbility.num_uses}</p>
          </div>
        )}
        {unitAbility.mana_cost !== undefined && unitAbility.mana_cost > 0 && (
          <div className="flex flex-row mr-3">
            <img className="w-6 h-6" src={windsImg} alt="winds icon" width="24" height="24" />
            <p className="ml-1 text-center">{unitAbility.mana_cost}</p>
          </div>
        )}
        {unitAbility.recharge_time !== undefined && unitAbility.recharge_time > 0 && (
          <div className="flex flex-row mr-3">
            <img className="w-6 h-6" src={cooldownImg} alt="cooldown icon" width="24" height="24" />
            <p className="ml-1 text-center">{unitAbility.recharge_time}s</p>
          </div>
        )}
      </div>
      {unitAbility.type.onscreen_name && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Type:</h5>
          <ReactImage srcList={typeSrcList} alt="type icon" w="24" h="24" className="w-5 h-5 my-auto mr-1" />
          <p
            className="my-auto ml-1"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(replaceKeepCaps(unitAbility.type.onscreen_name, searchString)),
            }}
          ></p>
        </div>
      )}
      {unitAbility.active_time !== undefined && unitAbility.active_time > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Duration:</h5>
          <p className="my-auto ml-1">{unitAbility.active_time}s</p>
        </div>
      )}
      {unitAbility.wind_up_time !== undefined && unitAbility.wind_up_time > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Wind Up:</h5>
          <p className="my-auto ml-1">{unitAbility.wind_up_time}s</p>
        </div>
      )}
      {unitAbility.shared_recharge_time !== undefined && unitAbility.shared_recharge_time > 0 && (
        <div className="flex flex-row mr-3">
          <h5 className="text-left w-24">Shared CD:</h5>
          <img className="w-5 h-5 my-auto" src={cooldownImg} alt="cooldown icon" width="24" height="24" />
          <p className="ml-1 text-center my-auto">{unitAbility.shared_recharge_time}s</p>
        </div>
      )}
      {doesTarget && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Targets:</h5>
          <p className="my-auto ml-1">{target}</p>
        </div>
      )}
      {unitAbility.enabled_if !== undefined && unitAbility.enabled_if.length > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Enabled If:</h5>
          <p className="my-auto ml-1">
            {unitAbility.enabled_if.map((string, index) => {
              let returnString = string;
              if (unitAbility.enabled_if !== undefined && unitAbility.enabled_if.length - 1 > index) {
                returnString += ', ';
              }
              return returnString;
            })}
          </p>
        </div>
      )}
      {unitAbility.target_if !== undefined && unitAbility.target_if.length > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Target If:</h5>
          <p className="my-auto ml-1">
            {unitAbility.target_if.map((string, index) => {
              let returnString = string;
              if (unitAbility.target_if !== undefined && unitAbility.target_if.length - 1 > index) {
                returnString += ', ';
              }
              return returnString;
            })}
          </p>
        </div>
      )}
      {unitAbility.num_effected_friendly_units !== undefined && unitAbility.num_effected_friendly_units > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">
            Target Cap
            {unitAbility.num_effected_enemy_units !== undefined &&
              unitAbility.num_effected_enemy_units > 0 &&
              ' (Friendly)'}
            :
          </h5>
          <p className="my-auto ml-1">{unitAbility.num_effected_friendly_units}</p>
        </div>
      )}
      {unitAbility.num_effected_enemy_units !== undefined && unitAbility.num_effected_enemy_units > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">
            Target Cap
            {unitAbility.num_effected_friendly_units !== undefined &&
              unitAbility.num_effected_friendly_units > 0 &&
              ' (Enemy)'}
            :
          </h5>
          <p className="my-auto ml-1">{unitAbility.num_effected_enemy_units}</p>
        </div>
      )}
      {unitAbility.target_intercept_range !== undefined && unitAbility.target_intercept_range > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Cast Range:</h5>
          <p className="my-auto ml-1">{unitAbility.target_intercept_range}</p>
        </div>
      )}
      {unitAbility.effect_range !== undefined && unitAbility.effect_range > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Effect range:</h5>
          <p className="my-auto ml-1">{unitAbility.effect_range}</p>
        </div>
      )}
      {unitAbility.min_range !== undefined && unitAbility.min_range > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Min Range:</h5>
          <p className="my-auto ml-1">{unitAbility.min_range}</p>
        </div>
      )}
      {unitAbility.ui_effects && (
        <div className="text-left">
          <h5 className="w-24">Effects:</h5>
          {unitAbility.ui_effects.map((skillEffect, index) => {
            return (
              <p
                key={index}
                className="text-lg whitespace-pre-wrap ml-6 text-yellow-200"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(replaceKeepCaps(skillEffect.localised_text, searchString)),
                }}
              ></p>
            );
          })}
        </div>
      )}
      {unitAbility?.phases !== undefined && unitAbility?.phases.length > 0 && (
        <div className="text-left">
          <h5 className="w-24">Phases:</h5>
          <div className="w-auto ml-6">
            {unitAbility?.phases?.map((phase, index) => {
              return <SkillPhase key={index} index={index} phase={phase} random={unitAbility.random_phases} />;
            })}
          </div>
        </div>
      )}
      {unitAbility.vortex !== undefined && (
        <div className="text-left">
          <h5 className="w-24">Vortex:</h5>
          <div className="w-auto ml-6">
            <SkillAbilityVortex vortex={unitAbility.vortex} />
          </div>
        </div>
      )}
      {unitAbility.activated_projectile !== undefined && (
        <div className="text-left">
          <h5 className="w-24">Projectile:</h5>
          <div className="w-auto ml-6">
            <SkillAbilityProjectile projectile={unitAbility.activated_projectile} />
          </div>
        </div>
      )}
      {unitAbility.bombardment !== undefined && (
        <div className="text-left">
          <h5 className="w-24">Bombardment:</h5>
          <div className="w-auto ml-6">
            <SkillAbilityBombardment bombardment={unitAbility.bombardment} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAbilityTooltip;
