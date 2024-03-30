import { Fragment } from 'react';
import { ProjectileInterface } from '../../../@types/CharacterInterfaceRef';
import SkillAbilityVortex from './SkillAbilityVortex';
import ReactImage from '../../ReactImage';

interface PropsInterface {
  projectile: ProjectileInterface;
}

const SkillAbilityProjectile = ({ projectile }: PropsInterface) => {
  let damageApRatio = ((projectile.ap_damage / (projectile.damage + projectile.ap_damage)) * 100).toFixed(0);
  if (damageApRatio === 'NaN') {
    damageApRatio = '0';
  }
  let explDamageApRatio;
  if (projectile.explosion_type !== undefined) {
    explDamageApRatio = (
      (projectile.explosion_type.detonation_damage_ap /
        (projectile.explosion_type.detonation_damage + projectile.explosion_type.detonation_damage_ap)) *
      100
    ).toFixed(0);
    if (explDamageApRatio === 'NaN') {
      explDamageApRatio = '0';
    }
  }
  return (
    <div className="w-auto rounded-lg border border-gray-500 mb-2 p-2 shadow-lg">
      <div className="flex flex-row">
        <h5 className="text-left w-24">Damage:</h5>
        <p className="my-auto ml-1">
          {projectile.damage + projectile.ap_damage} ({damageApRatio}%{' '}
          <img
            className="w-5 h-5 mb-1 inline"
            src="/imgs/vanilla3/skins/default/modifier_icon_armour_piercing_ranged.webp"
            alt="ap"
            width="24"
            height="24"
          />
          )
        </p>
        {projectile.is_flaming && (
          <img
            className="w-5 h-5 my-auto ml-1"
            src="/imgs/vanilla3/skins/default/modifier_icon_flaming.webp"
            alt="flaming"
            width="24"
            height="24"
          />
        )}
        {projectile.is_magical && (
          <img
            className="w-5 h-5 my-auto ml-1"
            src="/imgs/vanilla3/skins/default/modifier_icon_magical.webp"
            alt="flaming"
            width="24"
            height="24"
          />
        )}
      </div>
      {projectile.explosion_type !== undefined && (
        <Fragment>
          <div className="flex flex-row">
            <h5 className="w-24">Expl. Damage:</h5>
            <p className="my-auto ml-1">
              {projectile.explosion_type.detonation_damage + projectile.explosion_type.detonation_damage_ap} (
              {explDamageApRatio}%{' '}
              <img
                className="w-5 h-5 mb-1 inline"
                src="/imgs/vanilla3/skins/default/modifier_icon_armour_piercing_ranged.webp"
                alt="ap"
                width="24"
                height="24"
              />
              )
            </p>
            {projectile.explosion_type.is_flaming && (
              <img
                className="w-5 h-5 my-auto ml-1"
                src="/imgs/vanilla3/skins/default/modifier_icon_flaming.webp"
                alt="flaming"
                width="24"
                height="24"
              />
            )}
            {projectile.explosion_type.is_magical && (
              <img
                className="w-5 h-5 my-auto ml-1"
                src="/imgs/vanilla3/skins/default/modifier_icon_magical.webp"
                alt="flaming"
                width="24"
                height="24"
              />
            )}
          </div>
        </Fragment>
      )}
      {projectile.projectile_number !== undefined && projectile.projectile_number > 1 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Projectile #:</h5>
          <p className="my-auto ml-1">{projectile.projectile_number}</p>
        </div>
      )}
      {projectile.burst_size !== undefined && projectile.burst_size > 1 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Burst Size:</h5>
          <p className="my-auto ml-1">{projectile.burst_size}</p>
        </div>
      )}
      {projectile.shots_per_volley !== undefined && projectile.shots_per_volley > 1 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Shots Per Volley:</h5>
          <p className="my-auto ml-1">{projectile.shots_per_volley}</p>
        </div>
      )}
      {projectile.bonus_v_infantry !== undefined && projectile.bonus_v_infantry > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Bonus Vs. Small:</h5>
          <p className="my-auto ml-1">{projectile.bonus_v_infantry}</p>
        </div>
      )}
      {projectile.bonus_v_large !== undefined && projectile.bonus_v_large > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Bonus Vs. Large:</h5>
          <p className="my-auto ml-1">{projectile.bonus_v_large}</p>
        </div>
      )}
      <div className="flex flex-row">
        <h5 className="text-left w-24">Damage Radius:</h5>
        <p className="my-auto ml-1">{projectile.shockwave_radius}m</p>
      </div>
      {projectile.explosion_type !== undefined && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Expl. Radius:</h5>
          <p className="my-auto ml-1">{projectile.explosion_type.detonation_radius}m</p>
        </div>
      )}
      {projectile.can_damage_allies !== undefined && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Affects Allies:</h5>
          <p className="my-auto ml-1">{projectile.can_damage_allies ? 'Yes' : 'No'}</p>
        </div>
      )}
      {projectile.explosion_type !== undefined && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Expl. Affects Allies:</h5>
          <p className="my-auto ml-1">{projectile.explosion_type.affects_allies ? 'Yes' : 'No'}</p>
        </div>
      )}
      {projectile.contact_stat_effect !== undefined && (
        <div className="text-left flex flex-row flex-nowrap">
          <h5 className="w-24">Contact:</h5>
          <ReactImage
            srcList={[
              `/imgs/${projectile.contact_stat_effect.icon}.webp`,
              `/imgs/vanilla3/battle_ui/ability_icons/0_placeholder_passive_ability_icon.webp`,
            ]}
            className="my-auto mx-1 h-6 w-6"
            alt="contact"
            w="22"
            h="22"
          />
          <h4 className="text-lg ml-1">{projectile.contact_stat_effect.onscreen_name}</h4>
        </div>
      )}
      {projectile.explosion_type?.contact_phase_effect !== undefined && (
        <div className="text-left flex flex-row flex-nowrap">
          <h5 className="w-24">Expl. Contact:</h5>
          <ReactImage
            srcList={[
              `/imgs/${projectile.explosion_type.contact_phase_effect}.webp`,
              `/imgs/vanilla3/battle_ui/ability_icons/0_placeholder_passive_ability_icon.webp`,
            ]}
            className="my-auto mx-1 h-6 w-6"
            alt="contact"
            w="22"
            h="22"
          />
          <h4 className="text-lg ml-1">{projectile.explosion_type?.contact_phase_effect.onscreen_name}</h4>
        </div>
      )}
      {projectile.spawned_vortex !== undefined && (
        <div className="text-left">
          <h5 className="w-24">Vortex:</h5>
          <div className="w-auto ml-6">
            <SkillAbilityVortex vortex={projectile.spawned_vortex} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAbilityProjectile;
