import { VortexInterface } from '../../../types/interfaces/CharacterInterface';

interface PropsInterface {
  vortex: VortexInterface;
}

const SkillAbilityVortex = ({ vortex }: PropsInterface) => {
  let damageApRatio = ((vortex.damage_ap / (vortex.damage + vortex.damage_ap)) * 100).toFixed(0);
  if (damageApRatio === 'NaN') {
    damageApRatio = '0';
  }
  return (
    <div className="w-auto rounded-lg border border-gray-500 mb-2 p-2 shadow-lg">
      <div className="flex flex-row">
        <h5 className="text-left w-24">Duration:</h5>
        <p className="my-auto ml-1">{vortex.duration}s</p>
      </div>
      <div className="flex flex-row">
        <h5 className="text-left w-24">Damage:</h5>
        <p className="my-auto ml-1">
          {vortex.damage + vortex.damage_ap} ({damageApRatio}%{' '}
          <img
            className="w-5 h-5 mb-1 inline"
            src="/imgs/vanilla3/skins/default/modifier_icon_armour_piercing.webp"
            alt="ap"
            width="24"
            height="24"
          />
          )
        </p>
        {vortex.is_flaming && (
          <img
            className="w-5 h-5 my-auto ml-1"
            src="/imgs/vanilla3/skins/default/modifier_icon_flaming.webp"
            alt="flaming"
            width="24"
            height="24"
          />
        )}
        {vortex.is_magical && (
          <img
            className="w-5 h-5 my-auto ml-1"
            src="/imgs/vanilla3/skins/default/modifier_icon_magical.webp"
            alt="flaming"
            width="24"
            height="24"
          />
        )}
      </div>
      <div className="flex flex-row">
        <h5 className="text-left w-24">Radius:</h5>
        <p className="my-auto ml-1">{vortex.goal_radius}m</p>
      </div>
      <div className="flex flex-row">
        <h5 className="text-left w-24">Speed:</h5>
        <p className="my-auto ml-1">{vortex.movement_speed}m/s</p>
      </div>
      {vortex.delay > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Cast Delay:</h5>
          <p className="my-auto ml-1">{vortex.delay}s</p>
        </div>
      )}
      {vortex.num_vortexes !== undefined && vortex.num_vortexes > 1 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Vortex #:</h5>
          <p className="my-auto ml-1">{vortex.num_vortexes}</p>
        </div>
      )}
      {/* {vortex.delay_between_vortexes !== undefined && vortex.delay_between_vortexes > 0 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Delay Between Vortices:</h5>
          <p className="my-auto ml-1">{vortex.num_vortexes}</p>
        </div>
      )} */}
      <div className="flex flex-row">
        <h5 className="text-left w-24">Affects Allies:</h5>
        <p className="my-auto ml-1">{vortex.affects_allies ? 'Yes' : 'No'}</p>
      </div>
      {vortex.contact_effect !== undefined && (
        <div className="text-left flex flex-row flex-nowrap">
          <h5 className="w-24">Contact:</h5>
          <img
            src={`/imgs/${vortex.contact_effect.icon}.webp`}
            alt="contact"
            width="22"
            height="22"
            className="my-auto mx-1 h-6 w-6"
          />
          <h4 className="text-lg ml-1">{vortex.contact_effect.onscreen_name}</h4>
        </div>
      )}
    </div>
  );
};

export default SkillAbilityVortex;
