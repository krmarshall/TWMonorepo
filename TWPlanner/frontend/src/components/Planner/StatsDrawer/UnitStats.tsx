import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import TooltipWrapper from '../../TooltipWrapper';
import smallEntityIcon from '../../../imgs/other/icon_entity_small.webp';
import largeEntityIcon from '../../../imgs/other/icon_entity_large.webp';
import { loadAdvancedToggleFromStorage, saveAdvancedToggleToStorage } from '../../../utils/storageFunctions';
import SkillPhase from '../Tooltips/SkillPhase';
import UnitStatLine from './UnitStatLine';
import { getRelatedAttributes, getRelatedContactPhases, getUnitStatSets } from '../../../utils/sharedFunctions';
import AttributeTooltip from '../Tooltips/AttributeTooltip';
import TooltipAbilityMap from '../../TooltipAbilityMap';
import ReactImage from '../../ReactImage';

const UnitStats = () => {
  const { state } = useContext(AppContext);
  const { characterData, highlightArray } = state;
  const unitStatSets = getUnitStatSets(characterData);
  const [stats, setStats] = useState(unitStatSets[0].stats);

  const [advanced, setAdvanced] = useState(loadAdvancedToggleFromStorage());
  const [hasBarrier, setHasBarrier] = useState(stats.barrier !== undefined && stats.barrier > 0);

  useEffect(() => {
    if (stats.barrier !== undefined) {
      setHasBarrier(stats.barrier > 0);
    }
  }, [stats.barrier]);

  let healthClassName =
    'flex flex-row flex-nowrap h-6 justify-center mx-auto w-40 bg-green-600 border border-gray-800 rounded-md';
  if (hasBarrier) {
    healthClassName += ' outline outline-3 outline-blue-500 -outline-offset-4';
  }

  let hasMeleeModifiers = false;
  if (
    stats.bonus_v_infantry > 0 ||
    stats.bonus_v_large > 0 ||
    stats.ap_damage > stats.damage ||
    stats.is_flaming ||
    stats.is_magical ||
    stats.contact_phase !== undefined
  ) {
    hasMeleeModifiers = true;
  }

  let hasMissileModifiers = false;
  if (
    stats.projectile !== undefined &&
    ((stats.projectile.bonus_v_infantry !== undefined && stats.projectile.bonus_v_infantry > 0) ||
      (stats.projectile.bonus_v_large !== undefined && stats.projectile.bonus_v_large > 0) ||
      stats.projectile.ap_damage > stats.projectile.damage ||
      stats.projectile.is_flaming ||
      stats.projectile.is_magical ||
      stats.projectile.contact_stat_effect !== undefined)
  ) {
    hasMissileModifiers = true;
  }

  const sizeImg = stats.size === 'small' ? smallEntityIcon : largeEntityIcon;
  let shieldImg;
  if (stats.missile_block_chance === 0) {
    shieldImg = '';
  } else if (stats.missile_block_chance > 60) {
    shieldImg = '/imgs/vanilla3/skins/default/modifier_icon_shield3.webp';
  } else if (stats.missile_block_chance > 35) {
    shieldImg = '/imgs/vanilla3/skins/default/modifier_icon_shield2.webp';
  } else if (stats.missile_block_chance > 0) {
    shieldImg = '/imgs/vanilla3/skins/default/modifier_icon_shield1.webp';
  }
  return (
    <div className="text-gray-50 text-lg">
      <h3 className="text-3xl text-center">Character Stats</h3>

      <div className="mx-auto mb-1 flex flex-row flex-nowrap w-fit">
        <label htmlFor="advancedStatsCheckbox" className="text-xl text-center my-auto cursor-pointer">
          Advanced Stats
        </label>
        <input
          type="checkbox"
          id="advancedStatsCheckbox"
          defaultChecked={advanced}
          onChange={() => {
            const newAdvanced = !advanced;
            saveAdvancedToggleToStorage(newAdvanced);
            setAdvanced(newAdvanced);
          }}
          className="ml-2 cursor-pointer"
        />
      </div>
      {unitStatSets.length > 1 && (
        <div className="mx-auto mb-1 flex flex-row flex-nowrap w-fit">
          <p className="text-xl text-center my-auto">Mount</p>
          <select
            className="max-w-[12rem] ml-2 px-1 bg-gray-500 rounded text-xl font-CaslonAntique"
            onChange={(event) => {
              setStats(unitStatSets[parseInt(event.target.value)].stats);
            }}
          >
            {unitStatSets.map((statSet, index) => {
              return (
                <option key={index} value={index} className="text-base font-CaslonAntique">
                  {statSet.name}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <div className={healthClassName}>
        <img
          src="/imgs/vanilla3/skins/default/icon_stat_health_noframe.webp"
          alt="health"
          width="12"
          height="15"
          className="my-auto mr-1 scale-125"
        />
        <p className="text-center my-auto">
          {stats.hit_points + stats.bonus_hit_points}
          {stats.barrier === undefined || stats.barrier === 0 ? '' : ` + ${stats.barrier}`}
        </p>
      </div>
      <img src={sizeImg} alt="entity size" width="26" height="26" className="w-6 -mt-6 mb-1" />
      <UnitStatLine statName="Armour" imgPath="icon_stat_armour" statValue={stats.armour}>
        {shieldImg !== '' && (
          <TooltipWrapper
            tooltip={
              <div className="bg-gray-600 p-1.5 border border-gray-400 rounded-xl text-xl text-gray-50">
                {stats.missile_block_chance}% Missile Block
              </div>
            }
          >
            <img src={shieldImg} alt="shield" width="16" height="16" className="my-auto h-4 w-4" />
          </TooltipWrapper>
        )}
      </UnitStatLine>
      <UnitStatLine statName="Leadership" imgPath="icon_stat_morale" statValue={stats.morale} />
      <UnitStatLine statName="Speed" imgPath="icon_stat_speed" statValue={stats.run_speed * 10} />
      {stats.fly_speed !== undefined && stats.fly_speed !== 0 && (
        <UnitStatLine statName="Fly Speed" imgPath="icon_stat_speed" statValue={stats.fly_speed * 10} />
      )}
      <UnitStatLine statName="Mass" imgPath="icon_stat_mass" statValue={stats.mass} advanced={advanced} />

      <hr className="w-48 mx-auto opacity-50" />

      <UnitStatLine statName="Melee Attack" imgPath="icon_stat_attack" statValue={stats.melee_attack} />
      <UnitStatLine statName="Melee Defence" imgPath="icon_stat_defence" statValue={stats.melee_defence} />
      <UnitStatLine
        statName="Weapon Strength"
        imgPath="icon_stat_damage"
        statValue={stats.damage + stats.ap_damage}
        tooltip={
          <div className="flex flex-col bg-gray-600 p-1.5 border border-gray-400 rounded-xl text-xl text-gray-50">
            <div className="flex flex-row flex-nowrap">
              <img
                src="/imgs/vanilla3/skins/default/icon_stat_damage_base.webp"
                alt="damage"
                width="16"
                height="16"
                className="my-auto h-4 w-4 mr-1"
              />
              <p>{stats.damage} Base Damage</p>
            </div>
            <div className="flex flex-row flex-nowrap">
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_armour_piercing.webp"
                alt="ap damage"
                width="16"
                height="16"
                className="my-auto h-4 w-4 mr-1"
              />
              <p>{stats.ap_damage} Armour Piercing Damage</p>
            </div>
            {stats.bonus_v_infantry > 0 && (
              <div className="flex flex-row flex-nowrap">
                <img
                  src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_infantry.webp"
                  alt="bvi"
                  width="16"
                  height="16"
                  className="my-auto h-4 w-4 mr-1"
                />
                <p>{stats.bonus_v_infantry} Bonus Vs Infantry</p>
              </div>
            )}
            {stats.bonus_v_large > 0 && (
              <div className="flex flex-row flex-nowrap">
                <img
                  src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_large.webp"
                  alt="bvl"
                  width="16"
                  height="16"
                  className="my-auto h-4 w-4 mr-1"
                />
                <p>{stats.bonus_v_large} Bonus Vs Large</p>
              </div>
            )}
          </div>
        }
      />
      {hasMeleeModifiers && (
        <div className="flex flex-row flex-nowrap h-7">
          <p className="w-[45%]">Melee Modifiers</p>
          <div className="w-[55%] flex flex-row flex-nowrap">
            {stats.ap_damage > stats.damage && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_armour_piercing.webp"
                alt="ap"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.bonus_v_infantry > 0 && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_infantry.webp"
                alt="bvi"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.bonus_v_large > 0 && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_large.webp"
                alt="bvl"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.is_flaming && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_flaming.webp"
                alt="is flaming"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.is_magical && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_magical.webp"
                alt="is flaming"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.contact_phase !== undefined && (
              <TooltipWrapper
                tooltip={
                  <div className="rounded-lg text-xl text-gray-50">
                    <SkillPhase index={0} phase={stats.contact_phase} random={false} header={true} />
                  </div>
                }
              >
                <img
                  src={`/imgs/${stats.contact_phase.icon}.webp`}
                  alt="contact"
                  width="22"
                  height="22"
                  className="my-auto ml-1 h-5 w-5"
                />
              </TooltipWrapper>
            )}
          </div>
        </div>
      )}

      <UnitStatLine statName="Charge Bonus" imgPath="icon_stat_charge_bonus" statValue={stats.charge_bonus} />
      <UnitStatLine
        statName="Splash Targets"
        imgPath="icon_stat_damage_base_character"
        statValue={stats.splash_attack_max_attacks}
        advanced={advanced}
      />
      <UnitStatLine
        statName="Attack Interval"
        imgPath="icon_stat_damage_base_character"
        statValue={stats.melee_attack_interval}
        advanced={advanced}
      />

      {stats.projectile !== undefined && <hr className="w-48 mx-auto opacity-50" />}

      {stats.primary_ammo !== undefined && (
        <UnitStatLine statName="Ammunition" imgPath="icon_stat_ammo" statValue={stats.primary_ammo} />
      )}
      {stats.secondary_ammo !== undefined && stats.secondary_ammo > 0 && (
        <UnitStatLine
          statName="Alt Ammunition"
          imgPath="icon_stat_ammo"
          statValue={stats.secondary_ammo}
          advanced={advanced}
        />
      )}
      {stats.projectile !== undefined && (
        <UnitStatLine statName="Range" imgPath="icon_stat_range" statValue={stats.projectile.effective_range} />
      )}
      {stats.projectile !== undefined && (
        <UnitStatLine
          statName="Missile Strength"
          imgPath="icon_stat_ranged_damage"
          statValue={
            (stats.projectile.damage +
              stats.projectile.ap_damage +
              (stats.projectile.explosion_type?.detonation_damage ?? 0) +
              (stats.projectile.explosion_type?.detonation_damage_ap ?? 0)) *
            (stats.projectile.projectile_number ?? 1) *
            (stats.projectile.burst_size ?? 1)
          }
          tooltip={
            <div className="flex flex-col bg-gray-600 p-1.5 border border-gray-400 rounded-xl text-xl text-gray-50">
              <div className="flex flex-row flex-nowrap">
                <img
                  src="/imgs/vanilla3/skins/default/icon_stat_ranged_damage_base.webp"
                  alt="damage"
                  width="16"
                  height="16"
                  className="my-auto h-4 w-4 mr-1"
                />
                <p>{stats.projectile.damage} Base Damage</p>
              </div>
              <div className="flex flex-row flex-nowrap">
                <img
                  src="/imgs/vanilla3/skins/default/modifier_icon_armour_piercing_ranged.webp"
                  alt="ap damage"
                  width="16"
                  height="16"
                  className="my-auto h-4 w-4 mr-1"
                />
                <p>{stats.projectile.ap_damage} Armour Piercing Damage</p>
              </div>
              {stats.projectile.bonus_v_infantry !== undefined && stats.projectile.bonus_v_infantry > 0 && (
                <div className="flex flex-row flex-nowrap">
                  <img
                    src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_infantry.webp"
                    alt="damage"
                    width="16"
                    height="16"
                    className="my-auto h-4 w-4 mr-1"
                  />
                  <p>{stats.projectile.bonus_v_infantry} Bonus Vs Infantry</p>
                </div>
              )}
              {stats.projectile.bonus_v_large !== undefined && stats.projectile.bonus_v_large > 0 && (
                <div className="flex flex-row flex-nowrap">
                  <img
                    src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_large.webp"
                    alt="damage"
                    width="16"
                    height="16"
                    className="my-auto h-4 w-4 mr-1"
                  />
                  <p>{stats.projectile.bonus_v_large} Bonus Vs Large</p>
                </div>
              )}
              {stats.projectile.explosion_type?.detonation_damage !== undefined && (
                <div className="flex flex-row flex-nowrap">
                  <img
                    src="/imgs/vanilla3/skins/default/icon_explosive_damage.webp"
                    alt="damage"
                    width="16"
                    height="16"
                    className="my-auto h-4 w-4 mr-1"
                  />
                  <p>{stats.projectile.explosion_type?.detonation_damage} Explosive Damage</p>
                </div>
              )}
              {stats.projectile.explosion_type?.detonation_damage_ap !== undefined && (
                <div className="flex flex-row flex-nowrap">
                  <img
                    src="/imgs/vanilla3/skins/default/icon_stat_explosive_armour_piercing_damage.webp"
                    alt="ap damage"
                    width="16"
                    height="16"
                    className="my-auto h-4 w-4 mr-1"
                  />
                  <p>{stats.projectile.explosion_type?.detonation_damage_ap} AP Explosive Damage</p>
                </div>
              )}
              {stats.projectile.projectile_number !== undefined && (
                <div className="flex flex-row flex-nowrap">
                  <img
                    src="/imgs/vanilla3/skins/default/icon_stat_ranged_damage_base.webp"
                    alt="damage"
                    width="16"
                    height="16"
                    className="my-auto h-4 w-4 mr-1"
                  />
                  <p>{stats.projectile.projectile_number} Projectiles</p>
                </div>
              )}
              {stats.projectile.burst_size !== undefined && (
                <div className="flex flex-row flex-nowrap">
                  <img
                    src="/imgs/vanilla3/skins/default/icon_stat_ranged_damage_base.webp"
                    alt="damage"
                    width="16"
                    height="16"
                    className="my-auto h-4 w-4 mr-1"
                  />
                  <p>{stats.projectile.burst_size} Burst Size</p>
                </div>
              )}
            </div>
          }
        />
      )}
      {stats.projectile !== undefined && hasMissileModifiers && (
        <div className="flex flex-row flex-nowrap h-7">
          <p className="w-[45%]">Missile Modifiers</p>
          <div className="w-[55%] flex flex-row flex-nowrap">
            {stats.projectile.ap_damage > stats.projectile.damage && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_armour_piercing_ranged.webp"
                alt="bvi"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.projectile.bonus_v_infantry !== undefined && stats.projectile.bonus_v_infantry > 0 && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_infantry.webp"
                alt="bvi"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.projectile.bonus_v_large !== undefined && stats.projectile.bonus_v_large > 0 && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_bonus_vs_large.webp"
                alt="bvl"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.projectile.is_flaming && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_flaming.webp"
                alt="is flaming"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.projectile.is_magical && (
              <img
                src="/imgs/vanilla3/skins/default/modifier_icon_magical.webp"
                alt="is flaming"
                width="22"
                height="22"
                className="my-auto ml-1 h-5 w-5"
              />
            )}
            {stats.projectile.contact_stat_effect !== undefined && (
              <TooltipWrapper
                tooltip={
                  <div className="rounded-lg text-xl text-gray-50">
                    <SkillPhase index={0} phase={stats.projectile.contact_stat_effect} random={false} header={true} />
                  </div>
                }
              >
                <img
                  src={`/imgs/${stats.projectile.contact_stat_effect.icon}.webp`}
                  alt="contact"
                  width="22"
                  height="22"
                  className="my-auto ml-1 h-5 w-5"
                />
              </TooltipWrapper>
            )}
          </div>
        </div>
      )}

      {stats.projectile?.base_reload_time !== undefined && (
        <UnitStatLine statName="Reload Time" imgPath="icon_stat_range" statValue={stats.projectile?.base_reload_time} />
      )}
      {stats.fire_arc !== undefined && (
        <UnitStatLine statName="Fire Arc" imgPath="icon_stat_range" statValue={stats.fire_arc} advanced={advanced} />
      )}

      <hr className="w-48 mx-auto opacity-50" />

      {stats.damage_mod_flame !== 0 && (
        <UnitStatLine statName="Fire Resist" imgPath="resistance_fire" statValue={stats.damage_mod_flame} />
      )}
      {stats.damage_mod_magic !== 0 && (
        <UnitStatLine statName="Magic Resist" imgPath="resistance_magic" statValue={stats.damage_mod_magic} />
      )}
      {stats.damage_mod_physical !== 0 && (
        <UnitStatLine statName="Physical Resist" imgPath="resistance_physical" statValue={stats.damage_mod_physical} />
      )}
      {stats.damage_mod_missile !== 0 && (
        <UnitStatLine statName="Missile Resist" imgPath="resistance_missile" statValue={stats.damage_mod_missile} />
      )}
      {stats.damage_mod_all !== 0 && (
        <UnitStatLine statName="Ward Save" imgPath="resistance_ward_save" statValue={stats.damage_mod_all} />
      )}

      <hr className="w-48 mx-auto opacity-50" />

      {(stats.abilities !== undefined || stats.attributes !== undefined) && (
        <div className="flex flex-row flex-wrap place-content-center w-[16rem] mx-auto">
          {stats.can_siege && (
            <TooltipWrapper
              key="siege_attacker_manual"
              tooltip={
                <AttributeTooltip
                  attribute={{
                    key: 'siege_attacker',
                    description: 'Siege Attacker',
                    bullet_text:
                      'This unit can attack city gates, allowing you to instantly launch a siege battle without having to wait for towers or battering rams to be built.',
                    icon: 'vanilla3/battle_ui/ability_icons/can_siege',
                  }}
                />
              }
            >
              <img
                src="/imgs/vanilla3/battle_ui/ability_icons/can_siege.webp"
                alt="can_siege"
                width="38"
                height="38"
                className="my-auto ml-1 h-8 w-8 mt-1.5"
              />
            </TooltipWrapper>
          )}
          {stats.can_skirmish &&
            stats.attributes?.find((attribute) => attribute.key === 'mounted_fire_move') === undefined && (
              <TooltipWrapper
                key="mounted_fire_move_manual"
                tooltip={
                  <AttributeTooltip
                    attribute={{
                      key: 'mounted_fire_move',
                      description: 'Fire Whilst Moving',
                      bullet_text: 'This unit can fire while on the move.',
                      icon: 'vanilla3/battle_ui/ability_icons/mounted_fire_move',
                    }}
                  />
                }
              >
                <img
                  src="/imgs/vanilla3/battle_ui/ability_icons/mounted_fire_move.webp"
                  alt="mounted_fire_move"
                  width="38"
                  height="38"
                  className="my-auto ml-1 h-8 w-8 mt-1.5"
                />
              </TooltipWrapper>
            )}
          {stats.attributes?.map((attribute, index) => {
            let imgClassName = 'my-auto ml-1 h-8 w-8 mt-1.5';
            if (highlightArray?.unitStats.attributes?.[index]) {
              imgClassName += ' searchOutline rounded';
            }
            return (
              <TooltipWrapper key={attribute.key} tooltip={<AttributeTooltip attribute={attribute} />}>
                <div>
                  <ReactImage
                    srcList={[
                      `/imgs/${attribute.icon}.webp`,
                      '/imgs/vanilla3/battle_ui/ability_icons/0_placeholder_passive_ability_icon.webp',
                    ]}
                    alt="attribute"
                    className={imgClassName}
                    w="22"
                    h="22"
                  />
                </div>
              </TooltipWrapper>
            );
          })}
          {stats.abilities?.map((ability, index) => {
            const relatedPhases = getRelatedContactPhases(ability);
            const relatedAttributes = getRelatedAttributes(ability);
            let imgClassName = 'my-auto ml-1 h-8 w-8 mt-1.5 p-0.5';
            if (highlightArray?.unitStats.abilities?.[index]) {
              imgClassName += ' searchOutline rounded ';
            }
            return (
              <TooltipWrapper
                key={ability.unit_ability.key}
                tooltip={
                  <div className="max-h-[98vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700">
                    <TooltipAbilityMap
                      relatedAbilities={[ability]}
                      relatedPhases={relatedPhases}
                      relatedAttributes={relatedAttributes}
                      ctrCounter={0}
                    />
                  </div>
                }
              >
                <div>
                  <ReactImage
                    srcList={[
                      `/imgs/${ability.unit_ability.icon_name}.webp`,
                      '/imgs/vanilla3/battle_ui/ability_icons/0_placeholder_passive_ability_icon.webp',
                    ]}
                    alt="ability"
                    className={imgClassName}
                    w="22"
                    h="22"
                  />
                </div>
              </TooltipWrapper>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UnitStats;
