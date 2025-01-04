import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext.tsx';
import { PhaseInterface } from '../../../@types/CharacterInterfaceRef.ts';
import SkillPhaseAttribute from './SkillPhaseAttribute.tsx';
import SkillPhaseEffect from './SkillPhaseEffect.tsx';
import randomPhase0 from '../../../imgs/other/random_phase_0.webp';
import randomPhase1 from '../../../imgs/other/random_phase_1.webp';
import randomPhase2 from '../../../imgs/other/random_phase_2.webp';
import DOMPurify from 'dompurify';
import { replaceKeepCaps } from '../../../utils/sharedFunctions.ts';
import ReactImage from '../../ReactImage.tsx';

interface SkillPhaseProps {
  index: number;
  phase: PhaseInterface;
  random?: boolean;
  header?: boolean;
}

const SkillPhase = ({ index, phase, random, header = false }: SkillPhaseProps) => {
  const { state } = useContext(AppContext);
  const { selectedMod, searchString } = state;
  const type = phase.effect_type === 'positive' ? 'Buff' : 'Debuff';
  const imbueBoth = phase.imbue_magical && phase.imbue_ignition ? true : false;
  let targets = '';
  if (phase.target_self) targets += 'Self';
  if (phase.target_friends) {
    if (targets.length !== 0) targets += ', ';
    targets += 'Allies';
  }
  if (phase.target_enemies) {
    if (targets.length !== 0) targets += ', ';
    targets += 'Enemies';
  }

  let randImgSrc = '';
  if (random) {
    let diceImgNum = index;
    if (diceImgNum > 2) {
      const mult = diceImgNum / 3;
      const sub = Math.floor(mult) * 3;
      diceImgNum = diceImgNum - sub;
    }
    if (diceImgNum === 0) {
      randImgSrc = randomPhase0;
    } else if (diceImgNum === 1) {
      randImgSrc = randomPhase1;
    } else if (diceImgNum === 2) {
      randImgSrc = randomPhase2;
    }
  }

  const selectedGame = selectedMod.includes('2') ? '2' : '3';
  const borderColor = header ? ' border-gray-400' : ' border-gray-500';
  return (
    <div className="flex flex-row flex-nowrap mb-2 w-full text-gray-50 text-lg">
      {random && <img className="w-7 h-7 -ml-6 mr-1" src={randImgSrc} alt="random phase img" width="38" height="38" />}
      <div className={'w-full rounded-lg border p-2 shadow-lg bg-gray-600' + borderColor}>
        {header && (
          <div className="flex flex-row flex-nowrap">
            <ReactImage
              srcList={[
                `/imgs/${phase.icon}.webp`,
                `/imgs/vanilla3/battle_ui/ability_icons/0_placeholder_passive_ability_icon.webp`,
              ]}
              className="my-auto mx-1 h-8 w-8"
              alt="phase"
              w="22"
              h="22"
            />
            <h4
              className="text-2xl ml-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(replaceKeepCaps(phase.onscreen_name ?? '', searchString)),
              }}
            ></h4>
          </div>
        )}

        {phase.duration !== undefined && phase.duration > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Duration:</h5>
            <p className="my-auto ml-1">{phase.duration}s</p>
          </div>
        )}
        {phase.effect_type && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Effect Type:</h5>
            <p className="my-auto ml-1">{type}</p>
          </div>
        )}
        {targets.length !== 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Targets:</h5>
            <p className="my-auto ml-1">{targets}</p>
          </div>
        )}
        {phase.recharge_time !== undefined && phase.recharge_time > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Recharge Time:</h5>
            <p className="my-auto ml-1">{phase.recharge_time}</p>
          </div>
        )}
        {phase.fatigue_change_ratio !== undefined && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Fatigue:</h5>
            <p className="my-auto ml-1">{phase.fatigue_change_ratio * 100}%</p>
          </div>
        )}
        {phase.mana_regen_mod !== undefined && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Power Recharge:</h5>
            <p className="my-auto ml-1">
              {phase.mana_regen_mod > 0 ? '+' : '-'}
              {phase.mana_regen_mod * 100}%
            </p>
          </div>
        )}
        {phase.mana_max_depletion_mod !== undefined && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Reserves:</h5>
            <p className="my-auto ml-1">
              {phase.mana_max_depletion_mod > 0 ? '+' : '-'}
              {phase.mana_max_depletion_mod} Per Second
            </p>
          </div>
        )}
        {phase.ability_recharge_change !== undefined && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Decrease Cooldowns:</h5>
            <p className="my-auto ml-1">{phase.ability_recharge_change}s</p>
          </div>
        )}
        {phase.resurrect !== undefined && phase.resurrect === true && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Resurrects:</h5>
            <p className="my-auto ml-1">Yes</p>
          </div>
        )}
        {phase.hp_change_frequency !== undefined && phase.hp_change_frequency !== 1 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">HP Change Freq:</h5>
            <p className="my-auto ml-1">{phase.hp_change_frequency}s</p>
          </div>
        )}
        {selectedGame === '2' && phase.heal_amount !== undefined && phase.heal_amount > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Heal:</h5>
            <p className="my-auto ml-1">{phase.heal_amount}</p>
          </div>
        )}
        {selectedGame === '3' && phase.heal_amount !== undefined && phase.heal_amount > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Heal:</h5>
            <p className="my-auto ml-1">{phase.heal_amount * 100}%</p>
          </div>
        )}
        {phase.barrier_heal_amount !== undefined && phase.barrier_heal_amount > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Barrier Heal:</h5>
            <p className="my-auto ml-1">{phase.barrier_heal_amount * 100}%</p>
          </div>
        )}
        {phase.damage_amount !== undefined && phase.damage_amount > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Damage:</h5>
            <p className="my-auto ml-1">{phase.damage_amount} Per Entity</p>
          </div>
        )}
        {phase.damage_chance !== undefined && phase.damage_chance > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Dmg Chance:</h5>
            <p className="my-auto ml-1">{phase.damage_chance * 100}% Per Entity</p>
          </div>
        )}
        {phase.max_damaged_entities !== undefined && phase.max_damaged_entities > 0 && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Max Entities:</h5>
            <p className="my-auto ml-1">{phase.max_damaged_entities}</p>
          </div>
        )}
        {imbueBoth && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Imbues:</h5>
            <img
              src="/imgs/vanilla3/skins/default/modifier_icon_magical.webp"
              className="h-5 w-5 my-auto"
              alt="flaming attack"
              width="24"
              height="24"
            />
            <img
              src="/imgs/vanilla3/skins/default/modifier_icon_flaming.webp"
              className="h-5 w-5 my-auto mr-1"
              alt="flaming attack"
              width="24"
              height="24"
            />
            <p className="my-auto ml-1">Magical and Flaming Attacks</p>
          </div>
        )}
        {!imbueBoth && phase.imbue_magical !== undefined && phase.imbue_magical === true && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Imbues:</h5>
            <img
              src="/imgs/vanilla3/skins/default/modifier_icon_magical.webp"
              className="h-5 w-5 my-auto mr-1"
              alt="flaming attack"
              width="24"
              height="24"
            />
            <p className="my-auto ml-1">Magical Attacks</p>
          </div>
        )}
        {!imbueBoth && phase.imbue_ignition !== undefined && phase.imbue_ignition === true && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Imbues:</h5>
            <img
              src="/imgs/vanilla3/skins/default/modifier_icon_flaming.webp"
              className="h-5 w-5 my-auto mr-1"
              alt="flaming attack"
              width="24"
              height="24"
            />
            <p className="my-auto ml-1">Flaming Attacks</p>
          </div>
        )}
        {phase.imbue_contact !== undefined && (
          <div className="text-left flex flex-row flex-nowrap">
            <h5 className="w-24">Imbue Contact:</h5>
            <ReactImage
              srcList={[
                `/imgs/${phase.imbue_contact.icon}.webp`,
                `/imgs/vanilla3/battle_ui/ability_icons/0_placeholder_passive_ability_icon.webp`,
              ]}
              className="my-auto mx-1 h-6 w-6"
              alt="imbue contact"
              w="22"
              h="22"
            />
            <h4
              className="text-lg ml-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(replaceKeepCaps(phase.imbue_contact.onscreen_name ?? '', searchString)),
              }}
            ></h4>
          </div>
        )}
        {phase.replenish_ammo !== undefined && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Replenish Ammo:</h5>
            <p className="my-auto ml-1">{phase.replenish_ammo}%</p>
          </div>
        )}
        {phase.cant_move && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Can&apos;t Move:</h5>
            <p className="my-auto ml-1">Yes</p>
          </div>
        )}
        {phase.unbreakable && (
          <div className="flex flex-row">
            <img
              src="/imgs/vanilla3/campaign_ui/effect_bundles/attribute_unbreakable.webp"
              className="h-6 w-6 my-auto mr-[4.75rem]"
              alt="unbreakable"
              width="24"
              height="24"
            />
            <h5 className="text-left">Unbreakable</h5>
          </div>
        )}
        {phase.remove_magical && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Removes Magic Attacks:</h5>
            <p className="my-auto ml-1">Yes</p>
          </div>
        )}
        {phase.spread_radius && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Spread Radius:</h5>
            <p className="my-auto ml-1">{phase.spread_radius}m</p>
          </div>
        )}
        {phase.execute_ratio && (
          <div className="flex flex-row">
            <h5 className="text-left w-24">Execute Below:</h5>
            <p className="my-auto ml-1">{phase.execute_ratio * 100}% HP</p>
          </div>
        )}
        {phase.stat_effects && (
          <div className="text-left">
            <h5 className="w-24">Stat Effects:</h5>
            {phase.stat_effects.map((effect, index) => {
              return <SkillPhaseEffect key={index} effect={effect} />;
            })}
          </div>
        )}
        {phase.attributes !== undefined && phase.attributes.length > 0 && (
          <div className="text-left">
            <h5 className="w-24">Attributes:</h5>
            {phase.attributes.map((attr, index) => {
              return <SkillPhaseAttribute key={index} attribute={attr} index={index} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillPhase;
